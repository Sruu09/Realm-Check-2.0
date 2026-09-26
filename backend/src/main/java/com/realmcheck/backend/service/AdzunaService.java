package com.realmcheck.backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;

@Service
public class AdzunaService {

    @Value("${adzuna.app.id:}")
    private String appId;

    @Value("${adzuna.app.key:}")
    private String appKey;

    private final RestTemplate restTemplate = new RestTemplate();

    public String searchJobs(String keyword, String location) {
        if (appId == null || appId.isEmpty() || appKey == null || appKey.isEmpty()) {
            return "{\"results\":[]}"; // Return empty if not configured
        }
        
        try {
            String url = "https://api.adzuna.com/v1/api/jobs/in/search/1?app_id=" + appId + "&app_key=" + appKey + "&results_per_page=20";
            if (keyword != null && !keyword.isEmpty()) {
                url += "&what=" + URLEncoder.encode(keyword, StandardCharsets.UTF_8);
            }
            if (location != null && !location.isEmpty()) {
                url += "&where=" + URLEncoder.encode(location, StandardCharsets.UTF_8);
            }

            return restTemplate.getForObject(url, String.class);
        } catch (Exception e) {
            e.printStackTrace();
            return "{\"results\":[]}";
        }
    }
}
