package com.realmcheck.backend.entity;

import jakarta.persistence.*;
import java.time.LocalDate;

/**
 * Record of a single quest completion for a given user on a specific calendar day.
 * Guarantees uniqueness of (questId, userId, completedAt) to prevent duplicate rewards.
 */
@Entity
@Table(name = "quest_completion",
       uniqueConstraints = @UniqueConstraint(columnNames = {"quest_id", "user_id", "completed_at"}))
public class QuestCompletion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "quest_id", nullable = false)
    private Long questId;

    @Column(name = "user_id", nullable = false)
    private Long userId;

    /** Date (year-month-day) when the quest was completed */
    @Column(name = "completed_at", nullable = false)
    private LocalDate completedAt;

    @Column(name = "xp_reward")
    private Integer xpReward;


    // ---------------------------------------------------------------------
    // Getters and Setters
    // ---------------------------------------------------------------------
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getQuestId() { return questId; }
    public void setQuestId(Long questId) { this.questId = questId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public LocalDate getCompletedAt() { return completedAt; }
    public void setCompletedAt(LocalDate completedAt) { this.completedAt = completedAt; }

    public Integer getXpReward() { return xpReward; }
    public void setXpReward(Integer xpReward) { this.xpReward = xpReward; }


}
