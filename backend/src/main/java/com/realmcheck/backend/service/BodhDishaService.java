package com.realmcheck.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;

@Service
public class BodhDishaService {

    @Value("${bodhdisha.api.key}")
    private String apiKey;

    private final String BASE_URL = "https://bodhdisha.com/api/v1";
    private final RestTemplate restTemplate = new RestTemplate();

    public Object getScholarships() {
        return fetchFromBodhDisha("/scholarships");
    }

    public Object getExams() {
        return fetchFromBodhDisha("/exams");
    }

    public Object getColleges() {
        return fetchFromBodhDisha("/colleges");
    }

    public Object getUniversities() {
        return fetchFromBodhDisha("/universities");
    }

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
            return response.getBody();
        } catch (Exception e) {
            return "{\"error\": \"Failed to fetch data from BodhDisha: " + e.getMessage() + "\"}";
        }
    }
}
