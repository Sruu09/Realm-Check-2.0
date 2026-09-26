package com.realmcheck.backend.config;

import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.stereotype.Component;
import java.util.Map;

@Component
@ConfigurationProperties(prefix = "game")

/**
 * Loads game configuration constants from application.yml.
 */
public class GameConfig {
    private Map<String, Integer> xp;
    private Map<String, Double> level;
    private Map<String, Integer> health;
    private Map<String, Integer> streak;

    public Map<String, Integer> getXp() { return xp; }
    public void setXp(Map<String, Integer> xp) { this.xp = xp; }
    public Map<String, Double> getLevel() { return level; }
    public void setLevel(Map<String, Double> level) { this.level = level; }
    public Map<String, Integer> getHealth() { return health; }
    public void setHealth(Map<String, Integer> health) { this.health = health; }
    public Map<String, Integer> getStreak() { return streak; }
    public void setStreak(Map<String, Integer> streak) { this.streak = streak; }
}
