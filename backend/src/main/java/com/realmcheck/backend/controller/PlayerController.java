package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.PlayerStats;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.UserRepository;
import com.realmcheck.backend.service.GameProgressService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

/**
 * Controller exposing player statistics endpoint.
 */
@RestController
public class PlayerController {

    private final UserRepository userRepository;
    private final GameProgressService gameProgressService;

    @Autowired
    public PlayerController(UserRepository userRepository, GameProgressService gameProgressService) {
        this.userRepository = userRepository;
        this.gameProgressService = gameProgressService;
    }

    @GetMapping("/api/player/stats")
    public ResponseEntity<PlayerStats> getPlayerStats(@RequestParam Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        PlayerStats stats = gameProgressService.toDto(user);
        return ResponseEntity.ok(stats);
    }
}
