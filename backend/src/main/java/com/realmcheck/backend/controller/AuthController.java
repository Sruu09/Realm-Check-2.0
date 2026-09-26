package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.AuthRequest;
import com.realmcheck.backend.dto.AuthResponse;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.UserRepository;
import com.realmcheck.backend.repository.OnboardingProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private OnboardingProfileRepository onboardingRepo;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody AuthRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return ResponseEntity.badRequest().body("Email already exists");
        }

        User user = new User();
        user.setEmail(request.getEmail());
        user.setName(request.getName());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        
        userRepository.save(user);

        // For prototyping, send a mock token
        return ResponseEntity.ok(new AuthResponse("mock-jwt-token-123", user.getUserId(), true));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody AuthRequest request) {
        Optional<User> userOpt = userRepository.findByEmail(request.getEmail());
        if (userOpt.isEmpty() || !passwordEncoder.matches(request.getPassword(), userOpt.get().getPasswordHash())) {
            return ResponseEntity.status(401).body("Invalid credentials");
        }

        User user = userOpt.get();
        boolean hasOnboarded = onboardingRepo.findByUser(user).isPresent();
        
        return ResponseEntity.ok(new AuthResponse("mock-jwt-token-123", user.getUserId(), !hasOnboarded));
    }
}
