package com.realmcheck.backend.dto;

public class ScholarshipDTO {
    private Long id;
    private String name;
    private String provider;
    private String description;
    private String eligibility;
    private String amount;
    private String deadline;
    private String level;
    private String field;
    private String location;
    private String applicationUrl;
    private String status;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getEligibility() { return eligibility; }
    public void setEligibility(String eligibility) { this.eligibility = eligibility; }
    public String getAmount() { return amount; }
    public void setAmount(String amount) { this.amount = amount; }
    public String getDeadline() { return deadline; }
    public void setDeadline(String deadline) { this.deadline = deadline; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getField() { return field; }
    public void setField(String field) { this.field = field; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getApplicationUrl() { return applicationUrl; }
    public void setApplicationUrl(String applicationUrl) { this.applicationUrl = applicationUrl; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
