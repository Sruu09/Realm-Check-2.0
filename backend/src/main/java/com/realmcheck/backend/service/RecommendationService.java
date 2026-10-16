package com.realmcheck.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.realmcheck.backend.dto.RecommendationDTO;
import com.realmcheck.backend.entity.OnboardingProfile;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.OnboardingProfileRepository;
import com.realmcheck.backend.repository.UserRepository;
import com.realmcheck.backend.util.KeywordUtil;
import com.realmcheck.backend.service.LLMService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service that produces multi-source job recommendations with deduplication
 * and transparent relevance scoring.
 */
@Service
public class RecommendationService {
    private static final Logger LOG = LoggerFactory.getLogger(RecommendationService.class);

    private final AdzunaService adzunaService;
    private final JobicyService jobicyService;
    private final UserRepository userRepository;
    private final OnboardingProfileRepository onboardingProfileRepository;

    private final LLMService llmService;

    @Autowired
    public RecommendationService(AdzunaService adzunaService,
                                 JobicyService jobicyService,
                                 UserRepository userRepository,
                                 OnboardingProfileRepository onboardingProfileRepository,
                                 LLMService llmService) {
        this.adzunaService = adzunaService;
        this.jobicyService = jobicyService;
        this.userRepository = userRepository;
        this.onboardingProfileRepository = onboardingProfileRepository;
        this.llmService = llmService;
    }

    /**
     * Overloaded method to support parameter-based searches.
     */
    public List<RecommendationDTO> getRecommendations(String queryKeyword, String queryLocation) {
        return fetchAndScoreJobs(queryKeyword, queryLocation);
    }

    /**
     * Default method using current authenticated user's profile.
     */
    public List<RecommendationDTO> getRecommendations() {
        return fetchAndScoreJobs(null, null);
    }

    private List<RecommendationDTO> fetchAndScoreJobs(String queryKeyword, String queryLocation) {
        // 1. Resolve user profile (if authenticated)
        User user = resolveAuthenticatedUser();

        Set<String> userSkills = new HashSet<>();
        String preferredCareer = "";
        String userLocation = (queryLocation != null && !queryLocation.isBlank()) ? queryLocation : "";

        if (user != null) {
            if (user.getPreferredCareer() != null && !user.getPreferredCareer().isBlank()) {
                preferredCareer = user.getPreferredCareer();
            }
            onboardingProfileRepository.findByUser(user).ifPresent(profile -> {
                extractKeywordsFromJsonString(profile.getInterests()).forEach(userSkills::add);
                extractKeywordsFromJsonString(profile.getGoals()).forEach(userSkills::add);
            });
        }

        // Determine search keywords to pass upstream to APIs
        String effectiveKeyword = queryKeyword;
        if ((effectiveKeyword == null || effectiveKeyword.isBlank()) && !preferredCareer.isBlank()) {
            effectiveKeyword = preferredCareer;
        } else if ((effectiveKeyword == null || effectiveKeyword.isBlank()) && !userSkills.isEmpty()) {
            effectiveKeyword = userSkills.iterator().next();
        }

        // 2. Fetch from Adzuna (with error protection)
        List<RecommendationDTO> adzunaJobs = new ArrayList<>();
        try {
            String rawAdzunaJson = adzunaService.searchJobs(effectiveKeyword, userLocation);
            List<JsonNode> nodes = KeywordUtil.parseAdzunaResults(rawAdzunaJson);
            for (JsonNode node : nodes) {
                RecommendationDTO dto = toAdzunaDTO(node);
                if (dto != null) {
                    adzunaJobs.add(dto);
                }
            }
            LOG.info("Fetched {} jobs from Adzuna", adzunaJobs.size());
        } catch (Exception e) {
            LOG.warn("Failed to fetch Adzuna jobs: {}", e.getMessage());
        }

        // 3. Fetch from Jobicy (with independent error protection)
        List<RecommendationDTO> jobicyJobs = new ArrayList<>();
        try {
            jobicyJobs = jobicyService.searchJobs(effectiveKeyword, userLocation);
            LOG.info("Fetched {} jobs from Jobicy", jobicyJobs.size());
        } catch (Exception e) {
            LOG.warn("Failed to fetch Jobicy jobs: {}", e.getMessage());
        }

        // 4. Merge and Deduplicate across sources
        Map<String, RecommendationDTO> deduplicated = new LinkedHashMap<>();

        // Add Adzuna jobs
        for (RecommendationDTO job : adzunaJobs) {
            String key = KeywordUtil.generateDeduplicationKey(job.getTitle(), job.getCompany());
            deduplicated.put(key, job);
        }

        // Add Jobicy jobs; if duplicate exists, prefer existing or one with valid url
        for (RecommendationDTO job : jobicyJobs) {
            String key = KeywordUtil.generateDeduplicationKey(job.getTitle(), job.getCompany());
            if (!deduplicated.containsKey(key)) {
                deduplicated.put(key, job);
            }
        }

        // 5. Calculate transparent relevance scores
        List<RecommendationDTO> scoredList = new ArrayList<>();
        for (RecommendationDTO job : deduplicated.values()) {
            List<String> matchedTerms = new ArrayList<>();
            StringBuilder explanation = new StringBuilder();

            double score = KeywordUtil.computeScore(
                    userSkills,
                    preferredCareer,
                    userLocation,
                    job.getTitle(),
                    job.getCompany(),
                    job.getLocation(),
                    job.getExplanation(), // Initial raw description / source
                    matchedTerms,
                    explanation
            );

            job.setScore(score);
            job.setMatchedTerms(matchedTerms);

            // Generate LLM explanation if possible
            String userSkillsCsv = String.join(",", userSkills);
            String llmExplanation = llmService.generateExplanation(
                    userSkillsCsv,
                    preferredCareer,
                    job.getTitle(),
                    job.getExplanation()
            );
            if (llmExplanation != null && !llmExplanation.isBlank()) {
                job.setExplanation(llmExplanation);
            } else {
                job.setExplanation(explanation.toString());
            }

            scoredList.add(job);
        }

        // 6. Sort by relevance score descending
        scoredList.sort(Comparator.comparingDouble(RecommendationDTO::getScore).reversed());
        return scoredList;
    }

    private RecommendationDTO toAdzunaDTO(JsonNode job) {
        String title = safeText(job.path("title"));
        String company = safeText(job.path("company").path("display_name"));
        if (company.isEmpty()) company = safeText(job.path("company"));
        String location = safeText(job.path("location").path("display_name"));
        if (location.isEmpty()) location = safeText(job.path("location"));
        String url = safeText(job.path("redirect_url"));
        String description = safeText(job.path("description"));
        String salary = safeText(job.path("salary_min"));

        if (title.isBlank() || url.isBlank()) return null;

        RecommendationDTO dto = new RecommendationDTO();
        dto.setTitle(title);
        dto.setCompany(company.isBlank() ? "Unknown" : company);
        dto.setLocation(location.isBlank() ? "Unknown" : location);
        dto.setUrl(url);
        dto.setSource("Adzuna");
        dto.setSalary(salary.isBlank() ? "Salary Undisclosed" : "$" + salary);
        dto.setJobType(safeText(job.path("contract_time")));
        dto.setExplanation(description);
        return dto;
    }

    private User resolveAuthenticatedUser() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || auth.getName() == null) {
            return null;
        }
        String identifier = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(identifier);
        if (userOpt.isEmpty()) {
            userOpt = userRepository.findByEmail(identifier);
        }
        return userOpt.orElse(null);
    }

    private String safeText(JsonNode node) {
        return (node == null || node.isMissingNode() || node.isNull()) ? "" : node.asText();
    }

    private Set<String> extractKeywordsFromJsonString(String json) {
        if (json == null || json.isBlank()) return Set.of();
        try {
            JsonNode node = new com.fasterxml.jackson.databind.ObjectMapper().readTree(json);
            if (node.isArray()) {
                Set<String> set = new HashSet<>();
                node.forEach(elem -> {
                    String txt = elem.asText();
                    if (!txt.isBlank()) set.add(txt.trim().toLowerCase());
                });
                return set;
            }
        } catch (Exception ignored) {}
        return Arrays.stream(json.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}
