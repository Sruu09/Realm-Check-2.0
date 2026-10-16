package com.realmcheck.backend.service;

import com.realmcheck.backend.entity.Quest;
import com.realmcheck.backend.entity.QuestCompletion;
import com.realmcheck.backend.repository.QuestRepository;
import com.realmcheck.backend.repository.QuestCompletionRepository;
import org.springframework.stereotype.Service;
import com.realmcheck.backend.entity.User;
import org.springframework.transaction.annotation.Transactional;
import com.realmcheck.backend.service.GameProgressService;

import java.time.LocalDate;
import java.util.List;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final QuestCompletionRepository questCompletionRepository;
    private final UserService userService;
    private final GameProgressService gameProgressService;

    public QuestService(QuestRepository questRepository, QuestCompletionRepository questCompletionRepository, UserService userService, GameProgressService gameProgressService) {
        this.questRepository = questRepository;
        this.questCompletionRepository = questCompletionRepository;
        this.userService = userService;
        this.gameProgressService = gameProgressService;
    }

    public List<Quest> getQuestsByUserId(Long userId) {
        return questRepository.findByUserId(userId);
    }

    public Quest createQuest(Quest quest) {
        return questRepository.save(quest);
    }

    /**
     * Returns true if the given quest (must be daily) has already been completed today.
     */
    public boolean isQuestCompletedToday(Long questId) {
        Quest quest = questRepository.findById(questId).orElseThrow(() -> new RuntimeException("Quest not found"));
        if (!Boolean.TRUE.equals(quest.getIsDaily())) {
            return false;
        }
        LocalDate today = LocalDate.now();
        return questCompletionRepository.existsByQuestIdAndUserIdAndCompletedAt(questId, quest.getUserId(), today);
    }

    @Transactional
    public Quest completeQuest(Long questId) {
        Quest quest = questRepository.findById(questId).orElseThrow(() -> new RuntimeException("Quest not found"));
        // Daily quest handling
        if (Boolean.TRUE.equals(quest.getIsDaily())) {
            LocalDate today = LocalDate.now();
            boolean alreadyDone = questCompletionRepository.existsByQuestIdAndUserIdAndCompletedAt(questId, quest.getUserId(), today);
            if (alreadyDone) {
                // No reward, just return existing quest (status may already be COMPLETED)
                return quest;
            }
            // Award reward and record completion
            User user = userService.getUserById(quest.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
            gameProgressService.addXp(user, quest.getXpReward());
            // Gold award only

            QuestCompletion qc = new QuestCompletion();
            qc.setQuestId(questId);
            qc.setUserId(quest.getUserId());
            qc.setCompletedAt(today);
            qc.setXpReward(quest.getXpReward());

            questCompletionRepository.save(qc);
            // Mark quest as COMPLETED for UI purposes (but will be allowed again on next day)
            quest.setStatus("COMPLETED");
            questRepository.save(quest);
            return quest;
        }
        // Non‑daily quests – original behaviour
        if (!"COMPLETED".equals(quest.getStatus())) {
            quest.setStatus("COMPLETED");
            User user = userService.getUserById(quest.getUserId()).orElseThrow(() -> new RuntimeException("User not found"));
            gameProgressService.addXp(user, quest.getXpReward());
            // Gold award only

            questRepository.save(quest);
        }
        return quest;
    }

    public Quest updateQuestStatus(Long questId, String status) {
        Quest quest = questRepository.findById(questId).orElseThrow(() -> new RuntimeException("Quest not found"));
        quest.setStatus(status);
        return questRepository.save(quest);
    }
}
