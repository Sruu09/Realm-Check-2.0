package com.realmcheck.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "scholarships")
public class Scholarship {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String provider;

    @Column(length = 2000)
    private String description;

    @Column(length = 2000)
    private String eligibility;

    private String amount; // can be "Not specified"

    private String deadline; // store as text YYYY-MM-DD or "Not specified"

    private String level; // Undergraduate, Postgraduate, etc.

    private String field; // Engineering, IT, etc.

    private String location;

    @Column(name = "application_url")
    private String applicationUrl;

    private String status; // OPEN, UPCOMING, CLOSED

    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    // Constructors
    public Scholarship() {}

    public Scholarship(String name, String provider, String description, String eligibility, String amount,
                       String deadline, String level, String field, String location, String applicationUrl,
                       String status) {
        this.name = name;
        this.provider = provider;
        this.description = description;
        this.eligibility = eligibility;
        this.amount = amount;
        this.deadline = deadline;
        this.level = level;
        this.field = field;
        this.location = location;
        this.applicationUrl = applicationUrl;
        this.status = status;
    }

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
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
