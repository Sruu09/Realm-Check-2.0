package com.realmcheck.backend.dto;

import java.util.List;

/**
 * DTO representing a job recommendation returned by the recommendation endpoint.
 * It contains only the fields required by the frontend and a simple relevance score.
 */
public class RecommendationDTO {
    private String title;
    private String company;
    private String location;
    private String url;
    private double score; // simple relevance score, not a probability
    private List<String> matchedTerms;
    private String explanation;

    private String source;
    private String salary;
    private String jobType;

    public RecommendationDTO() {}

    public RecommendationDTO(String title, String company, String location, String url,
                             double score, List<String> matchedTerms, String explanation) {
        this(title, company, location, url, score, matchedTerms, explanation, "Adzuna", "", "");
    }

    public RecommendationDTO(String title, String company, String location, String url,
                             double score, List<String> matchedTerms, String explanation,
                             String source, String salary, String jobType) {
        this.title = title;
        this.company = company;
        this.location = location;
        this.url = url;
        this.score = score;
        this.matchedTerms = matchedTerms;
        this.explanation = explanation;
        this.source = source;
        this.salary = salary;
        this.jobType = jobType;
    }

    // Getters and setters
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCompany() { return company; }
    public void setCompany(String company) { this.company = company; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public double getScore() { return score; }
    public void setScore(double score) { this.score = score; }
    public List<String> getMatchedTerms() { return matchedTerms; }
    public void setMatchedTerms(List<String> matchedTerms) { this.matchedTerms = matchedTerms; }
    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getSalary() { return salary; }
    public void setSalary(String salary) { this.salary = salary; }
    public String getJobType() { return jobType; }
    public void setJobType(String jobType) { this.jobType = jobType; }
}
