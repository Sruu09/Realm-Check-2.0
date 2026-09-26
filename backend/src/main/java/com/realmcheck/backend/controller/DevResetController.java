package com.realmcheck.backend.controller;

import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.UserRepository;
import org.springframework.context.annotation.Profile;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;

/**
 * Development‑only controller to reset the test player's RPG progression.
 * This endpoint is active only when the Spring profile "dev" is enabled.
 */
@RestController
@Profile("dev")
@RequestMapping("/api/dev")
public class DevResetController {

    private final UserRepository userRepository;

    @Autowired
    public DevResetController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    /**
     * Reset the development/test player's RPG progression to initial values.
     * Does not affect any related entities (quests, journals, etc.).
     */
    @PostMapping("/reset-player")
    public ResponseEntity<String> resetPlayer() {
        // Identify the dev user – adjust email if a different test user is used.
        User user = userRepository.findByEmail("dev@test.com")
                .orElseThrow(() -> new IllegalArgumentException("Dev user not found"));
        user.setLevel(1);
        user.setXp(0);
        user.setStreak(0);
        user.setHealth(100);
        user.setEnergy(100);
        user.setKnowledge(0);
        user.setGold(0);
        user.setSavings(0.0);
        userRepository.save(user);
        return ResponseEntity.ok("Development player reset to initial state.");
    }
}
