package com.realmcheck.backend.service;

import com.realmcheck.backend.entity.User;
import com.realmcheck.backend.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.Optional;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public void addXpAndGold(Long userId, int xpAmount, int goldAmount) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setGold(user.getGold() + goldAmount);
        
        int totalXp = user.getXp() + xpAmount;
        int level = user.getLevel();
        int xpRequired = level * 100;
        
        while (totalXp >= xpRequired) {
            totalXp -= xpRequired;
            level++;
            xpRequired = level * 100;
        }
        
        user.setXp(totalXp);
        user.setLevel(level);
        userRepository.save(user);
    }

    @Transactional
    public void updateSavings(Long userId, double amount) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setSavings(user.getSavings() + amount);
        userRepository.save(user);
    }

    @Transactional
    public void updateMood(Long userId, String mood) {
        User user = userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found"));
        user.setCurrentMood(mood);
        userRepository.save(user);
    }
}
