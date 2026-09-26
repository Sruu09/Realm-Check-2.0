package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.OnboardingRequest;
import com.realmcheck.backend.entity.OnboardingProfile;
import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.OnboardingProfileRepository;
import com.realmcheck.backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/onboarding")
public class OnboardingController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private OnboardingProfileRepository onboardingRepo;

    @PostMapping
    public ResponseEntity<?> submitOnboarding(@RequestBody OnboardingRequest request) {
        Optional<User> userOpt = userRepository.findById(request.getUserId());
        if (userOpt.isEmpty()) {
            return ResponseEntity.badRequest().body("User not found");
        }

        User user = userOpt.get();
        OnboardingProfile profile = onboardingRepo.findByUser(user).orElse(new OnboardingProfile());
        
        profile.setUser(user);
        profile.setCurrentStage(request.getCurrentStage());
        profile.setInterests(request.getInterests());
        profile.setGoals(request.getGoals());
        profile.setDailyTime(request.getDailyTime());

        onboardingRepo.save(profile);

        return ResponseEntity.ok("Onboarding completed successfully");
    }
}
