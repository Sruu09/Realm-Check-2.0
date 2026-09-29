package com.realmcheck.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.MediaType;
import java.util.Map;
import java.util.HashMap;

@Service
public class ApifyService {

    @Value("${apify.api.token}")
    private String apiToken;

    private final RestTemplate restTemplate = new RestTemplate();

    public Object searchCourses(String search) {
        try {
            String url = "https://api.apify.com/v2/acts/crawlerbros~class-central-scraper/run-sync-get-dataset-items?token=" + apiToken;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, String> body = new HashMap<>();
            body.put("search", search);
            
            HttpEntity<Map<String, String>> entity = new HttpEntity<>(body, headers);
            
            ResponseEntity<Object> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Object.class
            );
            return response.getBody();
        } catch (Exception e) {
            return "{\"error\": \"Failed to fetch data from Apify: " + e.getMessage() + "\"}";
        }
    }
}
