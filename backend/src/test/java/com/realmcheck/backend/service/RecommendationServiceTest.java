package com.realmcheck.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realmcheck.backend.dto.RecommendationDTO;
import com.realmcheck.backend.entity.OnboardingProfile;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.OnboardingProfileRepository;
import com.realmcheck.backend.repository.UserRepository;
import com.realmcheck.backend.service.AdzunaService;
import com.realmcheck.backend.service.JobicyService;
import com.realmcheck.backend.service.LLMService;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

/**
 * Unit tests for {@link RecommendationService} focusing on profile‑based recommendation flow.
 * These tests mock all external dependencies (Adzuna, Jobicy, repositories) and the security context
 * to provide deterministic behaviour without calling live APIs.
 */
public class RecommendationServiceTest {

    @Mock
    private AdzunaService adzunaService;

    @Mock
    private JobicyService jobicyService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OnboardingProfileRepository onboardingProfileRepository;

    @Mock
    private LLMService llmService;

    @InjectMocks
    private RecommendationService recommendationService;

    private User mockUser;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        // Prepare a mock authenticated user
        mockUser = new User();
        mockUser.setUserId(1L);
        mockUser.setUsername("testuser");
        mockUser.setEmail("test@example.com");
        mockUser.setPreferredCareer("Software Engineer");
        // Mock SecurityContextHolder to return an Authentication whose name matches the user
        Authentication auth = mock(Authentication.class);
        when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);
        // Repository lookup by username/email
        when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(mockUser));
        when(userRepository.findByEmail("testuser")).thenReturn(Optional.empty());
    }

    @Test
    public void testRecommendationsWithFullProfile() throws Exception {
        // Mock onboarding profile containing interests and goals
        OnboardingProfile profile = new OnboardingProfile();
        profile.setUser(mockUser);
        profile.setInterests("Java,Spring,Backend");
        profile.setGoals("Full‑stack development,Leadership");
        when(onboardingProfileRepository.findByUser(mockUser)).thenReturn(Optional.of(profile));

        // Mock Adzuna response JSON (a minimal structure sufficient for parsing)
        String adzunaJson = "{\"results\":[{\"title\":\"Junior Java Developer\",\"company\":{\"display_name\":\"Acme Corp\"},\"location\":{\"display_name\":\"Remote\"},\"redirect_url\":\"https://example.com/job1\",\"description\":\"Great role\",\"salary_min\":\"50000\"}]}";
        when(adzunaService.searchJobs(anyString(), anyString())).thenReturn(adzunaJson);

        // Mock Jobicy returning one job DTO
        RecommendationDTO jobicyDto = new RecommendationDTO();
        jobicyDto.setTitle("Backend Engineer");
        jobicyDto.setCompany("Beta Ltd");
        jobicyDto.setLocation("Remote");
        jobicyDto.setUrl("https://jobicy.com/abc");
        jobicyDto.setSource("Jobicy");
        jobicyDto.setSalary("USD 60000");
        jobicyDto.setJobType("Full‑Time");
        when(jobicyService.searchJobs(anyString(), anyString())).thenReturn(List.of(jobicyDto));

        // Mock LLM explanation generation
        when(llmService.generateExplanation(anyString(), anyString(), anyString(), anyString())).thenReturn("Personalized explanation from LLM.");

        // Execute the service method (no explicit keyword/location – it should use profile data)
        List<RecommendationDTO> results = recommendationService.getRecommendations();
        assertNotNull(results);
        // Expect two results (one from each source) after deduplication
        assertEquals(2, results.size());
        // Verify that scores are computed and > 0 for at least one result
        assertTrue(results.stream().anyMatch(r -> r.getScore() > 0.0));
        // Verify that matchedTerms and explanation are populated
        RecommendationDTO first = results.get(0);
        assertNotNull(first.getMatchedTerms());
        assertNotNull(first.getExplanation());
    }

    @Test
    public void testRecommendationsWithMissingProfile() {
        // No onboarding profile for the user
        when(onboardingProfileRepository.findByUser(mockUser)).thenReturn(Optional.empty());
        // User has no preferredCareer (set to null)
        mockUser.setPreferredCareer(null);

        // Adzuna and Jobicy both return empty collections
        when(adzunaService.searchJobs(anyString(), anyString())).thenReturn("{\"results\":[]}");
        when(jobicyService.searchJobs(anyString(), anyString())).thenReturn(Collections.emptyList());

        List<RecommendationDTO> results = recommendationService.getRecommendations();
        assertNotNull(results);
        // With no source data, result list should be empty but not throw
        assertTrue(results.isEmpty());
    }
}
