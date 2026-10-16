
package com.realmcheck.backend.service;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class BodhDishaService {

    @Value("${bodhdisha.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://bodhdisha.com/api/v1";

    private final RestTemplate restTemplate = new RestTemplate();

    public Object getScholarships() {
        return getScholarships(null);
    }

    public Object getScholarships(String search) {
        String ep = (search != null && !search.isBlank()) 
            ? "/scholarships?search=" + java.net.URLEncoder.encode(search.trim(), java.nio.charset.StandardCharsets.UTF_8)
            : "/scholarships";
        return fetchFromBodhDisha(ep);
    }

    public Object getExams() {
        return getExams(null);
    }

    public Object getExams(String search) {
        String ep = (search != null && !search.isBlank()) 
            ? "/exams?search=" + java.net.URLEncoder.encode(search.trim(), java.nio.charset.StandardCharsets.UTF_8)
            : "/exams";
        return fetchFromBodhDisha(ep);
    }

    public Object getColleges() {
        return fetchFromBodhDisha("/colleges");
    }

    public Object getUniversities() {
        return fetchFromBodhDisha("/universities");
    }

    private final java.util.Map<String, Object> cache = new java.util.concurrent.ConcurrentHashMap<>();

    private Object fetchFromBodhDisha(String endpoint) {
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("Authorization", "Bearer " + apiKey);

            HttpEntity<String> entity = new HttpEntity<>(headers);

            ResponseEntity<Object> response = restTemplate.exchange(
                    BASE_URL + endpoint,
                    HttpMethod.GET,
                    entity,
                    Object.class
            );

            Object body = response.getBody();
            if (body != null) {
                cache.put(endpoint, body);
            }
            return body;

        } catch (Exception e) {
            // Return cached data if available (e.g. rate limit 429)
            if (cache.containsKey(endpoint)) {
                return cache.get(endpoint);
            }
            // For search endpoints, try falling back to base cached endpoint
            if (endpoint.contains("?")) {
                String baseEp = endpoint.substring(0, endpoint.indexOf("?"));
                if (cache.containsKey(baseEp)) {
                    return cache.get(baseEp);
                }
            }

            // Fallback to verified local seed data if external API rate limit or network error
            if (endpoint.startsWith("/scholarships")) {
                try {
                    org.springframework.core.io.ClassPathResource res = new org.springframework.core.io.ClassPathResource("scholarships_seed.json");
                    if (res.exists()) {
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        Object seedData = mapper.readValue(res.getInputStream(), Object.class);
                        return seedData;
                    }
                } catch (Exception ex) {
                    // Ignore and return error map
                }
            } else if (endpoint.startsWith("/exams")) {
                try {
                    org.springframework.core.io.ClassPathResource res = new org.springframework.core.io.ClassPathResource("exams_seed.json");
                    if (res.exists()) {
                        com.fasterxml.jackson.databind.ObjectMapper mapper = new com.fasterxml.jackson.databind.ObjectMapper();
                        Object seedData = mapper.readValue(res.getInputStream(), Object.class);
                        return seedData;
                    }
                } catch (Exception ex) {
                    // Ignore and return error map
                }
            }

            return Collections.singletonMap(
                    "error",
                    "Failed to fetch data from BodhDisha: " + e.getMessage()
            );
        }
    }
}
