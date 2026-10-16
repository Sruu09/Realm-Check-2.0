package com.realmcheck.backend.dto;

import java.util.List;

public class EducationRecommendationDTO {
    private String title;
    private String provider;
    private String description;
    private String url;
    private double score;
    private List<String> matchedTerms;

    public EducationRecommendationDTO() {}

    public EducationRecommendationDTO(String title, String provider, String description, String url, double score, List<String> matchedTerms) {
        this.title = title;
        this.provider = provider;
        this.description = description;
        this.url = url;
        this.score = score;
        this.matchedTerms = matchedTerms;
    }

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
    public List<String> getMatchedTerms() { return matchedTerms; }
    public void setMatchedTerms(List<String> matchedTerms) { this.matchedTerms = matchedTerms; }
}
