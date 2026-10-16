package com.realmcheck.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.Collections;

/**
 * Service that wraps a LLM provider (currently OpenAI) to generate personalized explanations.
 * If the API key is missing or the request fails, the service returns {@code null}
 * and the caller should fall back to the original static explanation.
 */
@Service
public class LLMService {
    private static final Logger LOG = LoggerFactory.getLogger(LLMService.class);
    private static final String OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";
    private static final String MODEL = "gpt-3.5-turbo";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${llm.enabled:true}")
    private boolean llmEnabled;

    // Optional API key; empty means LLM is disabled at runtime.
    @Value("${openai.api.key:}")
    private String openAiApiKey;

    public LLMService() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    /**
     * Generates a short explanation for a job recommendation.
     * Returns {@code null} if LLM is disabled, the API key is missing, or the call fails.
     */
    public String generateExplanation(String userSkillsCsv, String preferredCareer, String jobTitle, String jobDescription) {
        if (!llmEnabled) {
            LOG.info("LLM explanations disabled via configuration.");
            return null;
        }
        if (openAiApiKey == null || openAiApiKey.isBlank()) {
            LOG.warn("OpenAI API key not configured; skipping LLM explanation.");
            return null;
        }
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(openAiApiKey);
            headers.add("Content-Type", "application/json");

            String prompt = String.format(
                    "You are a career assistant. The user has the following skills: %s and prefers career: %s. " +
                    "Given a job titled '%s' with description: %s, produce a short (one‑sentence) explanation why this job matches the user, " +
                    "list any key missing skill(s), and suggest one concrete next step for the user. Keep the tone friendly.",
                    userSkillsCsv, preferredCareer, jobTitle, jobDescription);

            String payload = "{\"model\": \"" + MODEL + "\", \"messages\": [{\"role\": \"system\", \"content\": \"You are a helpful assistant.\"}, {\"role\": \"user\", \"content\": \"" +
                    prompt.replace("\"", "\\\"") + "\"}] }";

            HttpEntity<String> request = new HttpEntity<>(payload, headers);
            ResponseEntity<String> response = restTemplate.exchange(
                    OPENAI_ENDPOINT,
                    HttpMethod.POST,
                    request,
                    String.class);

            if (!response.getStatusCode().is2xxSuccessful() || response.getBody() == null) {
                LOG.warn("OpenAI API returned non‑2xx status: {}", response.getStatusCode());
                return null;
            }
            JsonNode root = objectMapper.readTree(response.getBody());
            JsonNode choices = root.path("choices");
            if (choices.isArray() && choices.size() > 0) {
                JsonNode message = choices.get(0).path("message").path("content");
                if (message.isTextual()) {
                    return message.asText().trim();
                }
            }
            LOG.warn("OpenAI response missing expected fields.");
            return null;
        } catch (Exception e) {
            LOG.warn("LLM call failed: {}", e.getMessage());
            return null;
        }
    }
}
