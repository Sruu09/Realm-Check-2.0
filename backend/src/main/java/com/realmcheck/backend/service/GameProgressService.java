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
        double base = gameConfig.getLevel().getOrDefault("base-xp", 100.0);
        double mult = gameConfig.getLevel().getOrDefault("multiplier", 1.25);
        return Math.round(base * Math.pow(mult, currentLevel - 1));
    }

    /**
     * Add XP to a user, handling level up and overflow.
     */
    @Transactional
    public void addXp(User user, int amount) {
        int newXp = user.getXp() + amount;
        while (newXp >= xpForNextLevel(user.getLevel())) {
            newXp -= xpForNextLevel(user.getLevel());
            user.setLevel(user.getLevel() + 1);
        }
        user.setXp(newXp);
        userRepository.save(user);
    }

    /**
     * Update other RPG stats (gold, energy, knowledge, health, streak, savings).
     */
    @Transactional
    public void updateStats(User user, int goldDelta, int energyDelta, int knowledgeDelta, int healthDelta, int streakDelta, double savingsDelta) {
        user.setGold(user.getGold() + goldDelta);
        user.setEnergy(user.getEnergy() + energyDelta);
        user.setKnowledge(user.getKnowledge() + knowledgeDelta);
        user.setHealth(user.getHealth() + healthDelta);
        user.setStreak(user.getStreak() + streakDelta);
        user.setSavings(user.getSavings() + savingsDelta);
        userRepository.save(user);
    }

    /**
     * Convert a User entity to the PlayerStats DTO.
     */
    public PlayerStats toDto(User user) {
        PlayerStats dto = new PlayerStats();
        dto.setUserId(user.getUserId());
        dto.setLevel(user.getLevel());
        dto.setXp(user.getXp());
        dto.setXpForNextLevel(xpForNextLevel(user.getLevel()));
        dto.setStreak(user.getStreak());
        dto.setHealth(user.getHealth());
        dto.setGold(user.getGold());
        dto.setTotalSavings(user.getSavings().longValue());
        return dto;
    }
}
