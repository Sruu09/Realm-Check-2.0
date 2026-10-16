package com.realmcheck.backend.repository;

import com.realmcheck.backend.entity.QuestCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import java.time.LocalDate;

public interface QuestCompletionRepository extends JpaRepository<QuestCompletion, Long> {
    boolean existsByQuestIdAndUserIdAndCompletedAt(Long questId, Long userId, LocalDate completedAt);
}
