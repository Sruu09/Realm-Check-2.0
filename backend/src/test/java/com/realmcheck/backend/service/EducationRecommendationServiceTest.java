package com.realmcheck.backend.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.realmcheck.backend.dto.EducationRecommendationDTO;
import com.realmcheck.backend.entity.OnboardingProfile;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.OnboardingProfileRepository;
import com.realmcheck.backend.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentMatchers;
import org.mockito.Mockito;
import org.mockito.Mock;
import org.mockito.InjectMocks;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;

import java.util.*;
import org.springframework.security.core.context.SecurityContextHolder;
import org.mockito.junit.jupiter.MockitoExtension;
import static org.junit.jupiter.api.Assertions.*;

import org.mockito.junit.jupiter.MockitoSettings;
import org.mockito.quality.Strictness;

@ExtendWith(MockitoExtension.class)
@MockitoSettings(strictness = Strictness.LENIENT)
class EducationRecommendationServiceTest {

    @InjectMocks
    private EducationRecommendationService recommendationService;
    private static final Logger LOG = LoggerFactory.getLogger(EducationRecommendationServiceTest.class);

    @Mock
    private ApifyService apifyService;

    @Mock
    private UserRepository userRepository;

    @Mock
    private OnboardingProfileRepository onboardingProfileRepository;

    private User testUser;
    private OnboardingProfile profile;

    @BeforeEach
    public void setUp() {
        // Mock authenticated user
        Authentication auth = Mockito.mock(Authentication.class, Mockito.withSettings().lenient());
        Mockito.when(auth.isAuthenticated()).thenReturn(true);
        Mockito.when(auth.getName()).thenReturn("testuser");
        SecurityContextHolder.getContext().setAuthentication(auth);

        testUser = new User();
        testUser.setUserId(1L);
        testUser.setUsername("testuser");
// password not needed for recommendation tests

        profile = new OnboardingProfile();
        profile.setUser(testUser);
        // simple JSON array strings
        profile.setInterests("[\"java\", \"spring\"]");
        profile.setGoals("[\"backend\"]");
    }

    @Test
    public void testRecommendedCourses_MatchingAndRanking() throws Exception {
        // Stubs
        Mockito.when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        Mockito.when(onboardingProfileRepository.findByUser(testUser)).thenReturn(Optional.of(profile));

        // Mock Apify response – a list of maps that Jackson can turn into JsonNode array
        Map<String, Object> course1 = new HashMap<>();
        course1.put("courseTitle", "Java Spring Boot Fundamentals");
        course1.put("provider", "Coursera");
        course1.put("description", "Learn backend development with Spring.");
        course1.put("courseUrl", "http://example.com/java-spring");

        Map<String, Object> course2 = new HashMap<>();
        course2.put("courseTitle", "Graphic Design Basics");
        course2.put("provider", "Udemy");
        course2.put("description", "Learn design principles.");
        course2.put("courseUrl", "http://example.com/design");

        List<Map<String, Object>> apifyResult = Arrays.asList(course1, course2);
        Mockito.when(apifyService.searchCourses(ArgumentMatchers.anyString()))
                .thenReturn(apifyResult);

        List<EducationRecommendationDTO> recommendations = recommendationService.getRecommendedCourses();
        assertNotNull(recommendations);
        assertEquals(1, recommendations.size(), "Only the Java course should match keywords");
        EducationRecommendationDTO dto = recommendations.get(0);
        assertTrue(dto.getMatchedTerms().contains("java"));
        assertTrue(dto.getScore() > 0);
        LOG.info("Recommendation DTO: {}", new ObjectMapper().writeValueAsString(dto));
    }

    @Test
    public void testRecommendedCourses_NoKeywordsResultsEmpty() {
        // Empty interests/goals
        profile.setInterests("[]");
        profile.setGoals("[]");
        Mockito.when(userRepository.findByUsername("testuser")).thenReturn(Optional.of(testUser));
        Mockito.when(onboardingProfileRepository.findByUser(testUser)).thenReturn(Optional.of(profile));
        // Apify should not be called, but we can stub anyway
        Mockito.when(apifyService.searchCourses(Mockito.anyString()))
                .thenReturn(Collections.emptyList());

        List<EducationRecommendationDTO> recommendations = recommendationService.getRecommendedCourses();
        assertNotNull(recommendations);
        assertTrue(recommendations.isEmpty(), "No keywords -> empty recommendation list");
    }

    @Test
    public void testRecommendedCourses_UnauthenticatedReturnsEmpty() {
        // Clear authentication
        SecurityContextHolder.getContext().setAuthentication(null);
        List<EducationRecommendationDTO> recommendations = recommendationService.getRecommendedCourses();
        assertNotNull(recommendations);
        assertTrue(recommendations.isEmpty(), "Unauthenticated request should yield empty list");
    }
}
