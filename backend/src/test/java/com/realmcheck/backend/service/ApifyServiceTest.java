package com.realmcheck.backend.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.Mockito;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import java.lang.reflect.Field;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;

class ApifyServiceTest {

    private ApifyService apifyService;
    private org.springframework.web.client.RestTemplate mockRestTemplate;
    private final String dummyToken = "dummy-token";

    @BeforeEach
    void setUp() throws Exception {
        apifyService = new ApifyService();
        // inject apiToken via reflection
        Field tokenField = ApifyService.class.getDeclaredField("apiToken");
        tokenField.setAccessible(true);
        tokenField.set(apifyService, dummyToken);
        // replace RestTemplate with mock
        mockRestTemplate = Mockito.mock(org.springframework.web.client.RestTemplate.class);
        Field restField = ApifyService.class.getDeclaredField("restTemplate");
        restField.setAccessible(true);
        restField.set(apifyService, mockRestTemplate);
    }

    @Test
    void testSearchCoursesConstructsCorrectRequestAndParsesData() {
        // Mock response from Apify
        Map<String, Object> responseBody = new HashMap<>();
        List<String> dataList = Arrays.asList("courseA", "courseB");
        responseBody.put("data", dataList);
        ResponseEntity<Object> responseEntity = new ResponseEntity<>(responseBody, HttpStatus.OK);
        Mockito.when(mockRestTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(Object.class)))
                .thenReturn(responseEntity);

        Object result = apifyService.searchCourses("java");
        assertEquals(dataList, result);

        // Capture arguments to verify URL and payload
        ArgumentCaptor<String> urlCaptor = ArgumentCaptor.forClass(String.class);
        ArgumentCaptor<HttpEntity> entityCaptor = ArgumentCaptor.forClass(HttpEntity.class);
        Mockito.verify(mockRestTemplate).exchange(urlCaptor.capture(), eq(HttpMethod.POST), entityCaptor.capture(), eq(Object.class));

        String capturedUrl = urlCaptor.getValue();
        assertTrue(capturedUrl.contains("powerai~classcentral-search-scraper"), "URL should contain updated actor ID");
        assertTrue(capturedUrl.endsWith("token=" + dummyToken), "URL should contain the API token");

        @SuppressWarnings("unchecked")
        Map<String, Object> sentBody = (Map<String, Object>) entityCaptor.getValue().getBody();
        assertNotNull(sentBody);
        assertEquals(20, sentBody.get("maxItems"));
        String searchUrl = (String) sentBody.get("searchUrl");
        assertNotNull(searchUrl);
        assertTrue(searchUrl.contains("https://www.classcentral.com/search?q=java"), "searchUrl should contain encoded query");
    }

    @Test
    void testSearchCoursesHandlesExceptionGracefully() {
        Mockito.when(mockRestTemplate.exchange(anyString(), eq(HttpMethod.POST), any(HttpEntity.class), eq(Map.class)))
                .thenThrow(new RuntimeException("boom"));
        Object result = apifyService.searchCourses("test");
        assertTrue(result instanceof String);
        String str = (String) result;
        assertTrue(str.contains("Failed to fetch data from Apify"), "Error message should be returned");
    }
}
