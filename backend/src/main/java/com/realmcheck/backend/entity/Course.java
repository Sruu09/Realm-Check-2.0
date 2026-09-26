package com.realmcheck.backend.entity;

import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String category; // e.g., PROGRAMMING, WEB DEVELOPMENT

    @Column(length = 2000)
    private String description;

    @Column(nullable = false)
    private String level; // Beginner, Intermediate, Advanced

    @Column(nullable = false)
    private String duration; // e.g., "4 weeks", "20h"

    @Column(nullable = false)
    private String provider; // e.g., Coursera, Udemy

    @Column(nullable = false)
    private String url;

    @Column(nullable = false)
    private String type; // e.g., VIDEO, ARTICLE, COURSE

    // Store tags as a comma‑separated string for simplicity
    private String tags;

    // Constructors
    public Course() {}

    public Course(String title, String category, String description, String level,
                  String duration, String provider, String url, String type, String tags) {
        this.title = title;
        this.category = category;
        this.description = description;
        this.level = level;
        this.duration = duration;
        this.provider = provider;
        this.url = url;
        this.type = type;
        this.tags = tags;
    }

    // Getters & Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getProvider() { return provider; }
    public void setProvider(String provider) { this.provider = provider; }
    public String getUrl() { return url; }
    public void setUrl(String url) { this.url = url; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getTags() { return tags; }
    public void setTags(String tags) { this.tags = tags; }
}
