package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.RecommendationDTO;
import com.realmcheck.backend.service.RecommendationService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * Exposes job recommendations for the authenticated user.
 * The endpoint is secured by the global Spring Security configuration – it relies on the
 * authenticated principal (email) that is set by the login flow.
 */
@RestController
@RequestMapping("/api/recommendations")
public class RecommendationController {

    private final RecommendationService recommendationService;

    public RecommendationController(RecommendationService recommendationService) {
        this.recommendationService = recommendationService;
    }

    @GetMapping("/jobs")
    public ResponseEntity<List<RecommendationDTO>> getJobRecommendations(
            @org.springframework.web.bind.annotation.RequestParam(required = false) String keyword,
            @org.springframework.web.bind.annotation.RequestParam(required = false) String location) {
        List<RecommendationDTO> recommendations = recommendationService.getRecommendations(keyword, location);
        return ResponseEntity.ok(recommendations);
    }
}
