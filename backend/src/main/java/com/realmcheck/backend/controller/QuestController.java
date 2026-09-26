package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.QuestDTO;
import com.realmcheck.backend.entity.Quest;
import com.realmcheck.backend.service.QuestService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/quests")
@CrossOrigin(origins = "*")
public class QuestController {

    private final QuestService questService;

    public QuestController(QuestService questService) {
        this.questService = questService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<QuestDTO>> getQuests(@PathVariable Long userId) {
        List<QuestDTO> dtos = questService.getQuestsByUserId(userId).stream().map(this::toDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<QuestDTO> createQuest(@RequestBody QuestDTO dto) {
        Quest quest = toEntity(dto);
        Quest saved = questService.createQuest(quest);
        return ResponseEntity.ok(toDTO(saved));
    }

    @PutMapping("/{id}/complete")
    public ResponseEntity<QuestDTO> completeQuest(@PathVariable Long id) {
        Quest completed = questService.completeQuest(id);
        return ResponseEntity.ok(toDTO(completed));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<QuestDTO> updateStatus(@PathVariable Long id, @RequestParam String status) {
        Quest updated = questService.updateQuestStatus(id, status);
        return ResponseEntity.ok(toDTO(updated));
    }

    private QuestDTO toDTO(Quest quest) {
        QuestDTO dto = new QuestDTO();
        dto.setId(quest.getId());
        dto.setUserId(quest.getUserId());
        dto.setTitle(quest.getTitle());
        dto.setDescription(quest.getDescription());
        dto.setDifficulty(quest.getDifficulty());
        dto.setXpReward(quest.getXpReward());
        dto.setGoldReward(quest.getGoldReward());
        dto.setStatus(quest.getStatus());
        dto.setIsDaily(quest.getIsDaily());
        dto.setCreatedAt(quest.getCreatedAt());
        return dto;
    }

    private Quest toEntity(QuestDTO dto) {
        Quest quest = new Quest();
        quest.setUserId(dto.getUserId());
        quest.setTitle(dto.getTitle());
        quest.setDescription(dto.getDescription());
        quest.setDifficulty(dto.getDifficulty());
        quest.setXpReward(dto.getXpReward());
        quest.setGoldReward(dto.getGoldReward());
        quest.setStatus(dto.getStatus());
        quest.setIsDaily(dto.getIsDaily());
        return quest;
    }
}
