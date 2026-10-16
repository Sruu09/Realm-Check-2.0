package com.realmcheck.backend.controller;

import com.realmcheck.backend.service.BodhDishaService;
import com.realmcheck.backend.service.ApifyService;
import com.realmcheck.backend.service.EducationRecommendationService;
import com.realmcheck.backend.service.CourseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/education")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EducationController {

    @Autowired
    private BodhDishaService bodhDishaService;

    @Autowired
    private ApifyService apifyService;

    @Autowired
    private CourseService courseService;

    @Autowired
    private EducationRecommendationService educationRecommendationService;


    @GetMapping("/scholarships")
    public ResponseEntity<Object> getScholarships(@RequestParam(required = false, name = "search") String search,
                                                  @RequestParam(required = false, name = "q") String q) {
        // Prefer 'search' parameter, fallback to 'q'
        String term = (search != null && !search.isBlank()) ? search.trim() : ((q != null && !q.isBlank()) ? q.trim() : null);
        Object data = bodhDishaService.getScholarships(term);
        if (term != null && data instanceof java.util.Map) {
            java.util.Map<?, ?> map = (java.util.Map<?, ?>) data;
            Object possible = map.containsKey("data") ? map.get("data") : (map.containsKey("scholarships") ? map.get("scholarships") : null);
            if (possible instanceof java.util.Collection) {
                java.util.List<Object> filtered = ((java.util.Collection<?>) possible).stream()
                    .filter(item -> item.toString().toLowerCase().contains(term.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok((Object) filtered);
            }
        } else if (term != null && data instanceof java.util.Collection) {
            java.util.List<Object> filtered = ((java.util.Collection<?>) data).stream()
                .filter(item -> item.toString().toLowerCase().contains(term.toLowerCase()))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok((Object) filtered);
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/exams")
    public ResponseEntity<Object> getExams(@RequestParam(required = false, name = "search") String search,
                                           @RequestParam(required = false, name = "q") String q) {
        String term = (search != null && !search.isBlank()) ? search.trim() : ((q != null && !q.isBlank()) ? q.trim() : null);
        Object data = bodhDishaService.getExams(term);
        if (term != null && data instanceof java.util.Map) {
            java.util.Map<?, ?> map = (java.util.Map<?, ?>) data;
            Object possible = map.containsKey("data") ? map.get("data") : (map.containsKey("exams") ? map.get("exams") : null);
            if (possible instanceof java.util.Collection) {
                java.util.List<Object> filtered = ((java.util.Collection<?>) possible).stream()
                    .filter(item -> item.toString().toLowerCase().contains(term.toLowerCase()))
                    .collect(java.util.stream.Collectors.toList());
                return ResponseEntity.ok((Object) filtered);
            }
        } else if (term != null && data instanceof java.util.Collection) {
            java.util.List<Object> filtered = ((java.util.Collection<?>) data).stream()
                .filter(item -> item.toString().toLowerCase().contains(term.toLowerCase()))
                .collect(java.util.stream.Collectors.toList());
            return ResponseEntity.ok((Object) filtered);
        }
        return ResponseEntity.ok(data);
    }

    @GetMapping("/colleges")
    public ResponseEntity<Object> getColleges() {
        return ResponseEntity.ok(bodhDishaService.getColleges());
    }

    @GetMapping("/universities")
    public ResponseEntity<Object> getUniversities() {
        return ResponseEntity.ok(bodhDishaService.getUniversities());
    }

    @GetMapping("/courses")
    public ResponseEntity<Object> getCourses(@RequestParam(required = false) String search) {
        if (search == null || search.isBlank()) {
            return ResponseEntity.ok(courseService.getCoursesPage(0, 12));
        }
        // First check internal courses in database
        java.util.List<com.realmcheck.backend.dto.CourseDTO> localResults = courseService.searchByKeyword(search.trim());
        if (!localResults.isEmpty()) {
            return ResponseEntity.ok(localResults);
        }
        // Fallback to external scraper if available
        try {
            Object apifyResult = apifyService.searchCourses(search.trim());
            return ResponseEntity.ok(apifyResult);
        } catch (Exception e) {
            return ResponseEntity.ok(localResults);
        }
    }

    @GetMapping("/courses/paged")
    public ResponseEntity<Object> getCoursesPaged(@RequestParam(defaultValue = "0") int page,
                                                  @RequestParam(defaultValue = "12") int size) {
        return ResponseEntity.ok(courseService.getCoursesPage(page, size));
    }

    @GetMapping("/recommended-courses")
    public ResponseEntity<Object> getRecommendedCourses() {
        return ResponseEntity.ok(educationRecommendationService.getRecommendedCourses());
    }
}
