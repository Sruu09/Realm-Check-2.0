package com.realmcheck.backend.repository;

import com.realmcheck.backend.entity.OnboardingProfile;
import com.realmcheck.backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface OnboardingProfileRepository extends JpaRepository<OnboardingProfile, Long> {
    Optional<OnboardingProfile> findByUser(User user);
}
