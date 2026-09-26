package com.realmcheck.backend.dto;

/**
 * Data Transfer Object representing the player statistics that are exposed to the frontend.
 * All fields are read‑only for the client; updates should be performed via the GameProgressService.
 */
public class PlayerStats {
    private Long userId;
    private int level;
    private long xp;
    private long xpForNextLevel;
    private int streak;
    private int health;
    private int gold;
    private long totalSavings;

    public PlayerStats() {}

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public int getLevel() { return level; }
    public void setLevel(int level) { this.level = level; }

    public long getXp() { return xp; }
    public void setXp(long xp) { this.xp = xp; }

    public long getXpForNextLevel() { return xpForNextLevel; }
    public void setXpForNextLevel(long xpForNextLevel) { this.xpForNextLevel = xpForNextLevel; }

    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }

    public int getHealth() { return health; }
    public void setHealth(int health) { this.health = health; }

    public int getGold() { return gold; }
    public void setGold(int gold) { this.gold = gold; }

    public long getTotalSavings() { return totalSavings; }
    public void setTotalSavings(long totalSavings) { this.totalSavings = totalSavings; }
}
