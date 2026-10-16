package com.realmcheck.backend.dto;

import java.util.List;

public class WizardChatRequest {
    private String category; // STUDY, CAREER, EXAM, PRODUCTIVITY
    private String message;
    private List<ChatMessageDTO> history;

    public WizardChatRequest() {}

    public WizardChatRequest(String category, String message, List<ChatMessageDTO> history) {
        this.category = category;
        this.message = message;
        this.history = history;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public List<ChatMessageDTO> getHistory() {
        return history;
    }

    public void setHistory(List<ChatMessageDTO> history) {
        this.history = history;
    }

    public static class ChatMessageDTO {
        private String role; // "user" or "assistant"
        private String content;

        public ChatMessageDTO() {}

        public ChatMessageDTO(String role, String content) {
            this.role = role;
            this.content = content;
        }

        public String getRole() {
            return role;
        }

        public void setRole(String role) {
            this.role = role;
        }

        public String getContent() {
            return content;
        }

        public void setContent(String content) {
            this.content = content;
        }
    }
}
