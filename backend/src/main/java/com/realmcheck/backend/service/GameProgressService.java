package com.realmcheck.backend.service;

import com.realmcheck.backend.config.GameConfig;
import com.realmcheck.backend.dto.PlayerStats;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service handling game progression logic such as XP calculation, level ups,
 * and updating various RPG stats. All operations are performed on the {@link User}
 * entity and persisted via {@link UserRepository}.
 */
@Service
public class GameProgressService {

    private final UserRepository userRepository;
    private final GameConfig gameConfig;

    @Autowired
    public GameProgressService(UserRepository userRepository, GameConfig gameConfig) {
        this.userRepository = userRepository;
        this.gameConfig = gameConfig;
    }

    /**
     * Calculate XP required for the next level based on base XP and multiplier.
     */
    public long xpForNextLevel(int currentLevel) {
        int lvl = Math.max(1, currentLevel);
        double base = gameConfig.getLevel().getOrDefault("base-xp", 100.0);
        double mult = gameConfig.getLevel().getOrDefault("multiplier", 1.25);
        return Math.round(base * Math.pow(mult, lvl - 1));
    }

    /**
     * Add XP to a user, handling level up and overflow.
     */
    @Transactional
    public void addXp(User user, int amount) {
        int currentLevel = user.getLevel() != null ? user.getLevel() : 1;
        int newXp = (user.getXp() != null ? user.getXp() : 0) + amount;
        while (newXp >= xpForNextLevel(currentLevel)) {
            newXp -= xpForNextLevel(currentLevel);
            currentLevel++;
        }
        user.setLevel(currentLevel);
        user.setXp(newXp);
        userRepository.save(user);
    }

    /**
     * Update other RPG stats (gold, energy, knowledge, health, streak, savings).
     */
    @Transactional
    public void updateStats(User user, int energyDelta, int knowledgeDelta, int healthDelta, int streakDelta, double savingsDelta) {
        user.setEnergy((user.getEnergy() != null ? user.getEnergy() : 100) + energyDelta);
        user.setKnowledge((user.getKnowledge() != null ? user.getKnowledge() : 0) + knowledgeDelta);
        user.setHealth((user.getHealth() != null ? user.getHealth() : 100) + healthDelta);
        user.setStreak((user.getStreak() != null ? user.getStreak() : 0) + streakDelta);
        user.setSavings((user.getSavings() != null ? user.getSavings() : 0.0) + savingsDelta);
        userRepository.save(user);
    }

    /**
     * Convert a User entity to the PlayerStats DTO.
     */
    public PlayerStats toDto(User user) {
        PlayerStats dto = new PlayerStats();
        dto.setUserId(user.getUserId());
        int lvl = user.getLevel() != null ? user.getLevel() : 1;
        dto.setLevel(lvl);
        dto.setXp(user.getXp() != null ? user.getXp() : 0);
        dto.setXpForNextLevel(xpForNextLevel(lvl));
        dto.setStreak(user.getStreak() != null ? user.getStreak() : 0);
        dto.setHealth(user.getHealth() != null ? user.getHealth() : 100);

        dto.setTotalSavings(user.getSavings() != null ? user.getSavings().longValue() : 0L);
        return dto;
    }
}
