package com.realmcheck.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.realmcheck.backend.dto.EducationRecommendationDTO;
import com.realmcheck.backend.entity.OnboardingProfile;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.OnboardingProfileRepository;
import com.realmcheck.backend.repository.UserRepository;
import com.realmcheck.backend.util.KeywordUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

/**
 * Service that produces course recommendations based on the authenticated user's onboarding profile.
 * It re‑uses the existing {@link ApifyService} to fetch courses and {@link KeywordUtil} to match keywords.
 */
@Service
public class EducationRecommendationService {
    private static final Logger LOG = LoggerFactory.getLogger(EducationRecommendationService.class);

    private final ApifyService apifyService;
    private final UserRepository userRepository;
    private final OnboardingProfileRepository onboardingProfileRepository;
    private final ObjectMapper mapper = new ObjectMapper();

    @Autowired
    public EducationRecommendationService(ApifyService apifyService,
                                          UserRepository userRepository,
                                          OnboardingProfileRepository onboardingProfileRepository) {
        this.apifyService = apifyService;
        this.userRepository = userRepository;
        this.onboardingProfileRepository = onboardingProfileRepository;
    }

    /**
     * Returns a ranked list of course recommendations for the current authenticated user.
     * If the user has no profile or no extracted keywords, an empty list is returned.
     */
    public List<EducationRecommendationDTO> getRecommendedCourses() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        if (auth == null || !auth.isAuthenticated() || auth.getName() == null) {
            LOG.warn("Unauthenticated request for course recommendations");
            return Collections.emptyList();
        }
        String username = auth.getName();
        Optional<User> userOpt = userRepository.findByUsername(username);
        if (userOpt.isEmpty()) {
            LOG.warn("User not found for identifier {}", username);
            return Collections.emptyList();
        }
        User user = userOpt.get();

        // Extract keywords from onboarding profile (interests + goals)
        Set<String> keywords = new HashSet<>();
        onboardingProfileRepository.findByUser(user).ifPresent(profile -> {
            LOG.debug("Extracting keywords from onboarding profile for user {}", user.getUserId());
            extractKeywordsFromJsonString(profile.getInterests()).forEach(keywords::add);
            extractKeywordsFromJsonString(profile.getGoals()).forEach(keywords::add);
        });
        if (keywords.isEmpty()) {
            LOG.info("No keywords found for user {} – returning empty recommendations", user.getUserId());
            return Collections.emptyList();
        }

        // Build a simple search term to avoid pulling the entire dataset.
        // Join keywords with spaces; Apify will treat this as a search query.
        String searchQuery = String.join(" ", keywords);
        Object rawResponse = apifyService.searchCourses(searchQuery);
        if (rawResponse == null) {
            LOG.warn("Apify service returned null for search query '{}'", searchQuery);
            return Collections.emptyList();
        }

        // Convert the raw response (which is likely a List or Map) into a JsonNode for easier traversal.
        JsonNode rootNode;
        try {
            // Serialize then deserialize to JsonNode to handle both List and Map structures uniformly.
            String json = mapper.writeValueAsString(rawResponse);
            rootNode = mapper.readTree(json);
        } catch (Exception e) {
            LOG.error("Failed to parse Apify response", e);
            return Collections.emptyList();
        }

        // Ensure we are dealing with an array of courses.
        List<JsonNode> courses = new ArrayList<>();
        if (rootNode.isArray()) {
            rootNode.forEach(courses::add);
        } else if (rootNode.isObject()) {
            // Some APIs wrap the list inside a field like "items" – handle common case.
            JsonNode items = rootNode.path("items");
            if (items.isArray()) {
                items.forEach(courses::add);
            }
        }

        List<EducationRecommendationDTO> recommendations = courses.stream()
                .map(course -> toRecommendation(course, keywords))
                .filter(Objects::nonNull)
                .sorted(Comparator.comparingDouble(EducationRecommendationDTO::getScore).reversed())
                .collect(Collectors.toList());
        return recommendations;
    }

    private EducationRecommendationDTO toRecommendation(JsonNode course, Set<String> keywords) {
        // Field names derived from Apify Class Central scraper documentation.
        String title = safeText(course.path("courseTitle"));
        String provider = safeText(course.path("provider"));
        String description = safeText(course.path("description"));
        String url = safeText(course.path("courseUrl"));

        List<String> matched = new ArrayList<>();
        matched.addAll(KeywordUtil.extractMatchedTerms(keywords, title));
        matched.addAll(KeywordUtil.extractMatchedTerms(keywords, provider));
        matched.addAll(KeywordUtil.extractMatchedTerms(keywords, description));
        if (matched.isEmpty()) {
            return null; // No relevance to user interests.
        }
        double score = 0.0;
        if (!KeywordUtil.extractMatchedTerms(keywords, title).isEmpty()) score += 0.5;
        if (!KeywordUtil.extractMatchedTerms(keywords, provider).isEmpty()) score += 0.2;
        if (!KeywordUtil.extractMatchedTerms(keywords, description).isEmpty()) score += 0.3;
        String explanation = "Matched on " + String.join(", ", matched);
        return new EducationRecommendationDTO(title, provider, description, url, score, matched);
    }

    private String safeText(JsonNode node) {
        return (node == null || node.isMissingNode() || node.isNull()) ? "" : node.asText();
    }

    /**
     * Parses a JSON string (either an array or CSV) into a set of lower‑cased keywords.
     */
    private Set<String> extractKeywordsFromJsonString(String json) {
        if (json == null || json.isBlank()) {
            return Set.of();
        }
        try {
            JsonNode node = mapper.readTree(json);
            if (node.isArray()) {
                Set<String> set = new HashSet<>();
                node.forEach(elem -> {
                    String txt = elem.asText();
                    if (!txt.isBlank()) set.add(txt.trim().toLowerCase());
                });
                return set;
            }
        } catch (Exception ignored) {}
        // Fallback to comma‑separated values.
        return Arrays.stream(json.split(","))
                .map(String::trim)
                .filter(s -> !s.isBlank())
                .map(String::toLowerCase)
                .collect(Collectors.toSet());
    }
}
