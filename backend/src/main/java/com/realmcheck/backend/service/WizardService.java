package com.realmcheck.backend.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.realmcheck.backend.dto.WizardChatRequest;
import com.realmcheck.backend.dto.WizardChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.http.client.SimpleClientHttpRequestFactory;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@Service
public class WizardService {
    private static final Logger LOG = LoggerFactory.getLogger(WizardService.class);
    private static final String OPENAI_ENDPOINT = "https://api.openai.com/v1/chat/completions";

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    @Value("${openai.api.key:}")
    private String openAiApiKey;

    @Value("${openai.model:gpt-4o-mini}")
    private String openAiModel;

    public WizardService() {
        SimpleClientHttpRequestFactory factory = new SimpleClientHttpRequestFactory();
        factory.setConnectTimeout(8000);
        factory.setReadTimeout(20000);
        this.restTemplate = new RestTemplate(factory);
        this.objectMapper = new ObjectMapper();
    }

    public WizardChatResponse processChat(WizardChatRequest request) {
        String category = normalizeCategory(request.getCategory());
        String userMessage = request.getMessage() != null ? request.getMessage().trim() : "";

        if (userMessage.isEmpty()) {
            return WizardChatResponse.fallback(
                "Greetings, young traveler. Whisper a thought or ask a question, and let us illuminate your path.",
                category,
                "Empty user query provided."
            );
        }

        if (userMessage.length() > 2000) {
            return WizardChatResponse.fallback(
                "Your inquiry is vast as the mystic scrolls! Pray shorten your query to under 2,000 characters so I may ponder it swiftly.",
                category,
                "Query exceeds allowed length limit."
            );
        }

        // Check if OpenAI API Key is present
        if (openAiApiKey == null || openAiApiKey.isBlank() || openAiApiKey.startsWith("${")) {
            LOG.warn("OpenAI API key not configured. Using Wizard built-in knowledge archive.");
            return WizardChatResponse.fallback(
                generateBuiltInGuidance(category, userMessage),
                category,
                "OpenAI API key not configured in environment. Using built-in Wizard scrolls."
            );
        }

        try {
            HttpHeaders headers = new HttpHeaders();
            headers.setBearerAuth(openAiApiKey.trim());
            headers.add("Content-Type", "application/json");

            List<Map<String, String>> messages = new ArrayList<>();
            messages.add(Map.of("role", "system", "content", buildSystemPrompt(category)));

            // Add previous messages if present (limit to last 6 for context and token efficiency)
            if (request.getHistory() != null && !request.getHistory().isEmpty()) {
                int start = Math.max(0, request.getHistory().size() - 6);
                for (int i = start; i < request.getHistory().size(); i++) {
                    WizardChatRequest.ChatMessageDTO h = request.getHistory().get(i);
                    if (h.getContent() != null && !h.getContent().isBlank()) {
                        String role = "assistant".equalsIgnoreCase(h.getRole()) ? "assistant" : "user";
                        messages.add(Map.of("role", role, "content", h.getContent().trim()));
                    }
                }
            }

            messages.add(Map.of("role", "user", "content", userMessage));

            Map<String, Object> payloadMap = new HashMap<>();
            payloadMap.put("model", openAiModel);
            payloadMap.put("messages", messages);
            payloadMap.put("temperature", 0.7);
            payloadMap.put("max_tokens", 600);

            String requestBody = objectMapper.writeValueAsString(payloadMap);
            HttpEntity<String> entity = new HttpEntity<>(requestBody, headers);

            ResponseEntity<String> response = restTemplate.exchange(
                OPENAI_ENDPOINT,
                HttpMethod.POST,
                entity,
                String.class
            );

            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                JsonNode choices = root.path("choices");
                if (choices.isArray() && choices.size() > 0) {
                    JsonNode msg = choices.get(0).path("message").path("content");
                    if (msg.isTextual() && !msg.asText().isBlank()) {
                        return WizardChatResponse.live(msg.asText().trim(), category);
                    }
                }
            }

            LOG.warn("OpenAI returned empty or unexpected structure.");
            return WizardChatResponse.fallback(
                generateBuiltInGuidance(category, userMessage),
                category,
                "OpenAI returned an empty response. Built-in guidance provided."
            );
        } catch (HttpStatusCodeException e) {
            String status = e.getStatusCode().toString();
            LOG.warn("OpenAI API call failed with status: {}. Reason: {}", status, e.getMessage());
            String reason = "OpenAI API returned " + status + " (Quota or billing limit).";
            return WizardChatResponse.fallback(
                generateBuiltInGuidance(category, userMessage),
                category,
                reason
            );
        } catch (Exception e) {
            LOG.error("Error communicating with OpenAI API: {}", e.getMessage());
            return WizardChatResponse.fallback(
                generateBuiltInGuidance(category, userMessage),
                category,
                "Connection to OpenAI API failed (" + e.getClass().getSimpleName() + "). Built-in guidance active."
            );
        }
    }

    private String normalizeCategory(String category) {
        if (category == null) return "STUDY";
        String upper = category.toUpperCase().trim();
        return switch (upper) {
            case "CAREER", "EXAM", "PRODUCTIVITY" -> upper;
            default -> "STUDY";
        };
    }

    private String buildSystemPrompt(String category) {
        String base = "You are the Grand Wizard of Realm Check 2.0, a wise, patient, warm, and practical fantasy RPG mentor. " +
            "You guide students and early-career adventurers in personal finance, technology, education, and career growth. " +
            "Your tone blends fantasy mentor wisdom (using subtle RPG metaphors like scrolls, quests, potions of focus, and XP) with direct, accurate, realistic real-world advice. " +
            "Never invent fake job openings, nonexistent degrees, or claim to know user details that haven't been provided. " +
            "Keep answers structured, clear, and actionable with concrete next steps.";

        return switch (category) {
            case "CAREER" -> base + " Focus Area: CAREER GUIDANCE. Provide skill roadmaps, resume improvement insights, interview strategies, and realistic industry insights.";
            case "EXAM" -> base + " Focus Area: EXAMINATION PREPARATION. Help design structured revision timetables, subject breakdowns, active recall practice questions, and exam pacing tips.";
            case "PRODUCTIVITY" -> base + " Focus Area: PRODUCTIVITY & HABITS. Break overwhelming goals into daily bite-sized tasks, suggest focus blocks (Pomodoro/rituals), and turn goals into achievable quests.";
            default -> base + " Focus Area: STUDY & LEARNING GUIDANCE. Explain technical and academic concepts simply, generate practice questions, and clarify confusing points with crisp examples.";
        };
    }

    public String generateBuiltInGuidance(String category, String userMessage) {
        String query = userMessage.toLowerCase();

        return switch (category) {
            case "CAREER" -> {
                if (query.contains("resume") || query.contains("cv")) {
                    yield "📜 *The Wizard unrolls a parchment of career craft:*\n\n" +
                        "1. **Impact over Duties**: Frame bullet points as `Accomplished [X], measured by [Y], by doing [Z]`.\n" +
                        "2. **Tech Stack Clarity**: Group your spells into Languages, Frameworks, Databases, and Tools.\n" +
                        "3. **Showcase Proof-of-Work**: Provide clean GitHub links and live demos for your best 2 projects.";
                } else if (query.contains("interview")) {
                    yield "⚔️ *The Wizard shares the art of interview mastery:*\n\n" +
                        "1. **STAR Method**: Structure behavioral answers into Situation, Task, Action, and Result.\n" +
                        "2. **Core Fundamentals**: Clarify time and space complexity before writing algorithmic solutions.\n" +
                        "3. **Ask Great Questions**: Inquire about team delivery cycles, testing rituals, and architecture.";
                } else {
                    yield "🧭 *The Wizard consults the Astrolabe of Careers:*\n\n" +
                        "To advance toward your dream role in tech or business:\n" +
                        "• **Identify 3 Core Pillars**: Master 1 core language (e.g. Java/Python), 1 framework (Spring Boot/React), and fundamentals (SQL/Git).\n" +
                        "• **Build a Public Artifact**: Create an end-to-end project solving a genuine problem.\n" +
                        "• **Network with Practitioners**: Seek feedback on GitHub and community discords.\n\n" +
                        "Tell me your preferred career domain (e.g., Backend, Frontend, AI/ML, DevOps), and I shall chart your roadmap!";
                }
            }
            case "EXAM" -> {
                if (query.contains("schedule") || query.contains("plan")) {
                    yield "⏳ *The Wizard drafts a Timetable of Mastery:*\n\n" +
                        "1. **Triage the Syllabus**: Sort topics into *Crucial* (high weightage), *Familiar*, and *Difficult*.\n" +
                        "2. **The 3:1 Ratio**: Spend 3 hours practicing past problems for every 1 hour of passive reading.\n" +
                        "3. **Daily Revision Cadence**: Dedicate the first 30 minutes every morning to reviewing yesterday's formulas.";
                } else {
                    yield "🛡️ *The Wizard activates the Sigil of Exam Preparation:*\n\n" +
                        "• **Active Recall**: Test yourself without looking at notes; flashcards and blank-sheet testing double retention.\n" +
                        "• **Spaced Repetition**: Review challenging topics on Day 1, Day 3, and Day 7.\n" +
                        "• **Mock Trials**: Simulate full-length exam conditions once a week.\n\n" +
                        "Share your specific subject, exam name, or upcoming exam date, and we will formulate an exact revision battle plan!";
                }
            }
            case "PRODUCTIVITY" -> {
                yield "🌿 *The Wizard prepares an Elixir of Focus:*\n\n" +
                    "1. **The Rule of 3 Quests**: Choose only 3 high-impact tasks each morning. When these 3 are complete, consider the day victorious.\n" +
                    "2. **Focus Bursts**: Work for 25 uninterrupted minutes, followed by 5 minutes of rest.\n" +
                    "3. **Friction Minimization**: Prepare your workspace the evening before so starting requires zero resistance.\n\n" +
                    "What task feels most daunting right now? Let us slice it into a 10-minute micro-quest together.";
            }
            default -> { // STUDY
                if (query.contains("oop") || query.contains("object oriented")) {
                    yield "🔮 *The Wizard explains Object-Oriented Programming:*\n\n" +
                        "• **Encapsulation**: Like a locked spellbook—hiding internal state and exposing safe methods.\n" +
                        "• **Inheritance**: A Mage Apprentice inheriting knowledge and robes from the Archmage.\n" +
                        "• **Polymorphism**: Casting `attack()`—a warrior swings a blade, while a wizard casts a fireball.\n" +
                        "• **Abstraction**: Knowing how to operate a magical carriage without knowing its clockwork innards.";
                } else {
                    yield "📖 *The Wizard opens the Codex of Learning:*\n\n" +
                        "To conquer complex technical concepts effectively:\n" +
                        "1. **Feynman Technique**: Explain the idea in plain words as if teaching a novice villager.\n" +
                        "2. **Hands-on Experimentation**: Write code or solve sample problems immediately after reading.\n" +
                        "3. **Identify Knowledge Chasms**: Note down the exact moment confusion occurs and isolate that sub-concept.\n\n" +
                        "Which concept or subject are you exploring today? State your topic and I will break it down step-by-step!";
                }
            }
        };
    }
}
