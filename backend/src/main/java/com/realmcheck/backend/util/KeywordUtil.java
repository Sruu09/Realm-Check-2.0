package com.realmcheck.backend.util;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.io.IOException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

/**
 * Utility for extracting matched terms, computing transparent relevance scores,
 * and generating deduplication keys.
 */
public class KeywordUtil {

    private static final ObjectMapper mapper = new ObjectMapper();

    /**
     * Normalizes title and company into a unique composite deduplication key.
     */
    public static String generateDeduplicationKey(String title, String company) {
        String cleanTitle = (title == null ? "" : title.toLowerCase().replaceAll("[^a-z0-9]", " ").replaceAll("\\s+", " ").trim());
        String cleanCompany = (company == null ? "" : company.toLowerCase().replaceAll("[^a-z0-9]", " ").replaceAll("\\s+", " ").trim());
        return cleanTitle + "|" + cleanCompany;
    }

    /**
     * Returns the list of terms from {@code keywords} that appear in the given text (case-insensitive).
     */
    public static List<String> extractMatchedTerms(Set<String> keywords, String text) {
        if (text == null || text.isEmpty() || keywords == null) {
            return List.of();
        }
        String lower = text.toLowerCase();
        return keywords.stream()
                .filter(k -> k != null && !k.isBlank())
                .filter(lower::contains)
                .collect(Collectors.toList());
    }

    /**
     * Evaluates a multi-factor transparent relevance score:
     * - Role Alignment (30% weight): user's preferredCareer in job title/description
     * - Skill / Interest Match (50% weight): fraction of user's skills matched
     * - Location / Eligibility (20% weight): user location match or "Remote" / "Worldwide"
     *
     * Missing profile attributes do not artificially inflate scores.
     */
    public static double computeScore(Set<String> userSkills,
                                       String preferredCareer,
                                       String targetLocation,
                                       String jobTitle,
                                       String jobCompany,
                                       String jobLocation,
                                       String jobDescription,
                                       List<String> matchedTerms,
                                       StringBuilder explanation) {

        double roleScore = 0.0;
        double skillScore = 0.0;
        double locationScore = 0.0;

        List<String> reasons = new ArrayList<>();
        String fullJobText = (jobTitle + " " + (jobDescription != null ? jobDescription : "")).toLowerCase();

        // 1. Role Alignment (max 0.30)
        if (preferredCareer != null && !preferredCareer.isBlank()) {
            String careerLower = preferredCareer.toLowerCase().trim();
            if (jobTitle != null && jobTitle.toLowerCase().contains(careerLower)) {
                roleScore = 0.30;
                reasons.add("Title matches career goal '" + preferredCareer + "'");
                matchedTerms.add(preferredCareer);
            } else if (fullJobText.contains(careerLower)) {
                roleScore = 0.15;
                reasons.add("Description references career goal '" + preferredCareer + "'");
            }
        }

        // 2. Skill / Interest Matching (max 0.50)
        if (userSkills != null && !userSkills.isEmpty()) {
            List<String> foundSkills = extractMatchedTerms(userSkills, fullJobText);
            for (String skill : foundSkills) {
                if (!matchedTerms.contains(skill)) {
                    matchedTerms.add(skill);
                }
            }

            if (!foundSkills.isEmpty()) {
                double matchRatio = Math.min(1.0, (double) foundSkills.size() / Math.min(3, userSkills.size()));
                skillScore = matchRatio * 0.50;
                reasons.add("Matched " + foundSkills.size() + " skill(s): " + String.join(", ", foundSkills));
            }
        }

        // 3. Location / Eligibility (max 0.20)
        String jobLocLower = jobLocation != null ? jobLocation.toLowerCase() : "";
        if (jobLocLower.contains("remote") || jobLocLower.contains("worldwide") || jobLocLower.contains("anywhere")) {
            locationScore = 0.20;
            reasons.add("Remote/Worldwide eligibility");
        } else if (targetLocation != null && !targetLocation.isBlank() && jobLocLower.contains(targetLocation.toLowerCase().trim())) {
            locationScore = 0.20;
            reasons.add("Location matches '" + targetLocation + "'");
        } else if (jobLocLower.contains("india") || jobLocLower.contains("usa") || jobLocLower.contains("us")) {
            locationScore = 0.10;
        }

        double totalScore = Math.min(1.0, roleScore + skillScore + locationScore);

        if (reasons.isEmpty()) {
            explanation.append("General opportunity listing");
        } else {
            explanation.append(String.join(" • ", reasons));
        }

        return Math.round(totalScore * 100.0) / 100.0;
    }

    /**
     * Parses the raw JSON string returned by AdzunaService.
     */
    public static List<JsonNode> parseAdzunaResults(String json) {
        if (json == null) {
            return new ArrayList<>();
        }
        try {
            JsonNode root = mapper.readTree(json);
            JsonNode results = root.path("results");
            if (results.isArray()) {
                List<JsonNode> list = new ArrayList<>();
                results.forEach(list::add);
                return list;
            }
        } catch (IOException e) {
            // Return empty list on parse failure
        }
        return new ArrayList<>();
    }
}
