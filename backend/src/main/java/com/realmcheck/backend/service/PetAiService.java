package com.realmcheck.backend.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriUtils;

import java.nio.charset.StandardCharsets;

@Service
public class PetAiService {
    private static final Logger LOG = LoggerFactory.getLogger(PetAiService.class);
    private final RestTemplate restTemplate;

    public PetAiService() {
        this.restTemplate = new RestTemplate();
    }

    public String getPetResponse(String prompt) {
        try {
            String safePrompt = (prompt == null || prompt.isBlank())
                    ? "Say something cute, motivating and playful to your owner in one short sentence as a magical dog pet companion in an RPG realm."
                    : "You are a loyal and cheerful magical dog pet companion in an RPG fantasy realm. In 1 or 2 concise, enthusiastic sentences, respond to your owner who says: " + prompt;

            String encodedPrompt = UriUtils.encodePathSegment(safePrompt, StandardCharsets.UTF_8);
            String url = "https://text.pollinations.ai/" + encodedPrompt;

            String response = restTemplate.getForObject(url, String.class);
            if (response != null && !response.isBlank()) {
                return response.trim();
            }
        } catch (Exception e) {
            LOG.warn("Pollinations AI call failed: {}", e.getMessage());
        }
        // Fallback if network or provider fails
        return "Woof! Let's conquer our daily quests and gain more XP together!";
    }
}
