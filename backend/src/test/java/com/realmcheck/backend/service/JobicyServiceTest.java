package com.realmcheck.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.realmcheck.backend.dto.RecommendationDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentMatchers;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.web.client.RestTemplate;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

/**
 * Tests for {@link JobicyService} focusing on JSON parsing and failure handling.
 */
public class JobicyServiceTest {

    @Mock
    private RestTemplate restTemplate;

    @Mock
    private ObjectMapper objectMapper;

    private JobicyService jobicyService;

    @BeforeEach
    public void setUp() {
        MockitoAnnotations.openMocks(this);
        jobicyService = new JobicyService(restTemplate, objectMapper);
    }

    @Test
    public void testSuccessfulParsing() throws Exception {
        // Mock raw JSON response
        String json = "{\"jobs\":[{\"jobTitle\":\"DevOps Engineer\",\"companyName\":\"Alpha Ltd\",\"jobGeo\":\"Remote\",\"url\":\"https://jobicy.com/def\",\"jobType\":\"Contract\",\"annualSalaryMin\":\"80000\",\"salaryCurrency\":\"USD\"}]}";
        ResponseEntity<String> response = ResponseEntity.ok(json);
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenReturn(response);
        JsonNode root = new ObjectMapper().readTree(json);
        when(objectMapper.readTree(json)).thenReturn(root);

        List<RecommendationDTO> result = jobicyService.searchJobs("devops", "");
        assertNotNull(result);
        assertEquals(1, result.size());
        RecommendationDTO dto = result.get(0);
        assertEquals("DevOps Engineer", dto.getTitle());
        assertEquals("Alpha Ltd", dto.getCompany());
        assertEquals("Remote", dto.getLocation());
        assertEquals("https://jobicy.com/def", dto.getUrl());
        assertEquals("Jobicy", dto.getSource());
        assertEquals("$80000", dto.getSalary());
        assertEquals("Contract", dto.getJobType());
    }

    @Test
    public void testProviderFailureReturnsEmpty() {
        // Simulate exception during HTTP call
        when(restTemplate.exchange(anyString(), eq(HttpMethod.GET), any(HttpEntity.class), eq(String.class)))
                .thenThrow(new RuntimeException("Network error"));
        List<RecommendationDTO> result = jobicyService.searchJobs("anything", "anywhere");
        assertNotNull(result);
        assertTrue(result.isEmpty(), "On failure the service should return an empty list");
    }
}
