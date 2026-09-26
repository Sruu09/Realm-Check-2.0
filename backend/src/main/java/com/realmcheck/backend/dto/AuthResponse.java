package com.realmcheck.backend.dto;

public class AuthResponse {
    private String token;
    private Long userId;
    private boolean isFirstTime;

    public AuthResponse(String token, Long userId, boolean isFirstTime) {
        this.token = token;
        this.userId = userId;
        this.isFirstTime = isFirstTime;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public boolean isFirstTime() { return isFirstTime; }
    public void setFirstTime(boolean firstTime) { isFirstTime = firstTime; }
}
