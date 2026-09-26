package com.realmcheck.backend.service;

import com.realmcheck.backend.entity.Quest;
import com.realmcheck.backend.repository.QuestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class QuestService {

    private final QuestRepository questRepository;
    private final UserService userService;

    public QuestService(QuestRepository questRepository, UserService userService) {
        this.questRepository = questRepository;
        this.userService = userService;
    }

    public List<Quest> getQuestsByUserId(Long userId) {
        return questRepository.findByUserId(userId);
    }

    public Quest createQuest(Quest quest) {
        return questRepository.save(quest);
    }

    @Transactional
    public Quest completeQuest(Long questId) {
        Quest quest = questRepository.findById(questId).orElseThrow(() -> new RuntimeException("Quest not found"));
        if (!"COMPLETED".equals(quest.getStatus())) {
            quest.setStatus("COMPLETED");
            userService.addXpAndGold(quest.getUserId(), quest.getXpReward(), quest.getGoldReward());
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
