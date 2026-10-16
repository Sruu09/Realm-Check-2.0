package com.realmcheck.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.realmcheck.backend.dto.RecommendationDTO;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Service to fetch remote job opportunities from Jobicy's free public API.
 * Guarantees fault tolerance: if the API times out or fails, returns an empty list
 * without affecting other sources.
 */
@Service
public class JobicyService {

    private static final Logger LOG = LoggerFactory.getLogger(JobicyService.class);
    private static final String JOBICY_API_URL = "https://jobicy.com/api/v2/remote-jobs";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    // Default constructor for production (creates its own instances)
    public JobicyService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    // Constructor for testing – allows injection of mocks
    public JobicyService(RestTemplate restTemplate, ObjectMapper objectMapper) {
        this.restTemplate = restTemplate;
        this.objectMapper = objectMapper;
    }

    public List<RecommendationDTO> searchJobs(String keyword, String location) {
        try {
            StringBuilder urlBuilder = new StringBuilder(JOBICY_API_URL).append("?count=20");

            if (keyword != null && !keyword.isBlank()) {
                urlBuilder.append("&tag=").append(URLEncoder.encode(keyword.trim(), StandardCharsets.UTF_8));
            }
            if (location != null && !location.isBlank()) {
                urlBuilder.append("&geo=").append(URLEncoder.encode(location.trim(), StandardCharsets.UTF_8));
            }

            HttpHeaders headers = new HttpHeaders();
            headers.set("User-Agent", "RealmCheck/2.0 (JobMatcher)");
            HttpEntity<Void> requestEntity = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(
                    urlBuilder.toString(),
                    HttpMethod.GET,
                    requestEntity,
                    String.class
            );

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                LOG.warn("Jobicy API returned non-2xx status: {}", response.getStatusCode());
                return Collections.emptyList();
            }

            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode jobsNode = root.path("jobs");
            if (!jobsNode.isArray()) {
                return Collections.emptyList();
            }

            List<RecommendationDTO> results = new ArrayList<>();
            for (JsonNode job : jobsNode) {
                String title = job.path("jobTitle").asText("");
                String company = job.path("companyName").asText("Unknown");
                String jobGeo = job.path("jobGeo").asText("Remote");
                String url = job.path("url").asText("");
                String jobType = job.path("jobType").asText("Full-Time");
                String minSalary = job.path("annualSalaryMin").asText("");
                String currency = job.path("salaryCurrency").asText("USD");
                String salaryStr = minSalary.isBlank() ? "Salary Undisclosed" : com.realmcheck.backend.util.CurrencyUtil.mapSymbol(currency) + minSalary;

                if (title.isBlank() || url.isBlank()) {
                    continue; // Skip malformed listings
                }

                RecommendationDTO dto = new RecommendationDTO();
                dto.setTitle(title);
                dto.setCompany(company);
                dto.setLocation(jobGeo);
                dto.setUrl(url);
                dto.setSource("Jobicy");
                dto.setSalary(salaryStr);
                dto.setJobType(jobType);
                dto.setScore(0.0);
                dto.setMatchedTerms(new ArrayList<>());
                dto.setExplanation("Fetched from Jobicy");

                results.add(dto);
            }

            LOG.info("Successfully fetched {} jobs from Jobicy", results.size());
            return results;

        } catch (Exception e) {
            LOG.warn("Jobicy job fetch failed safely: {}", e.getMessage());
            return Collections.emptyList();
        }
    }
}
