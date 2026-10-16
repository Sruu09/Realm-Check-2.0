package com.realmcheck.backend.dto;

public class WizardChatResponse {
    private String response;
    private String category;
    private String source; // "OPENAI" or "BUILTIN_GUIDANCE"
    private boolean fallback;
    private String fallbackReason;

    public WizardChatResponse() {}

    public WizardChatResponse(String response, String category, String source, boolean fallback, String fallbackReason) {
        this.response = response;
        this.category = category;
        this.source = source;
        this.fallback = fallback;
        this.fallbackReason = fallbackReason;
    }

    public static WizardChatResponse live(String response, String category) {
        return new WizardChatResponse(response, category, "OPENAI", false, null);
    }

    public static WizardChatResponse fallback(String response, String category, String reason) {
        return new WizardChatResponse(response, category, "BUILTIN_GUIDANCE", true, reason);
    }

    public String getResponse() {
        return response;
    }

    public void setResponse(String response) {
        this.response = response;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public String getSource() {
        return source;
    }

    public void setSource(String source) {
        this.source = source;
    }

    public boolean isFallback() {
        return fallback;
    }

    public void setFallback(boolean fallback) {
        this.fallback = fallback;
    }

    public String getFallbackReason() {
        return fallbackReason;
    }

    public void setFallbackReason(String fallbackReason) {
        this.fallbackReason = fallbackReason;
    }
}
