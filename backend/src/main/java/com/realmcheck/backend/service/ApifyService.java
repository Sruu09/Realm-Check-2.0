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
            String url = "https://api.apify.com/v2/acts/powerai~classcentral-search-scraper/run-sync-get-dataset-items?token=" + apiToken;
            
            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);
            
            Map<String, Object> body = new HashMap<>();
            String encoded = java.net.URLEncoder.encode(search, java.nio.charset.StandardCharsets.UTF_8);
            body.put("searchUrl", "https://www.classcentral.com/search?q=" + encoded);
            body.put("maxItems", 20);
            
            HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers);

            // Expect the actor to return a JSON array directly; use Object response type
            ResponseEntity<Object> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    Object.class
            );
            Object respBody = response.getBody();
            // Defensive handling: if a wrapper map is returned, try to extract list
            if (respBody instanceof java.util.List) {
                return respBody;
            } else if (respBody instanceof java.util.Map) {
                java.util.Map<?, ?> map = (java.util.Map<?, ?>) respBody;
                if (map.containsKey("data")) {
                    return map.get("data");
                }
                return map;
            }
            return respBody;
        } catch (Exception e) {
            return "{\"error\": \"Failed to fetch data from Apify: " + e.getMessage() + "\"}";
        }
    }
}
