package com.realmcheck.backend.service;

import com.realmcheck.backend.entity.Exam;
import com.realmcheck.backend.entity.StudySession;
import com.realmcheck.backend.repository.ExamRepository;
import com.realmcheck.backend.repository.StudySessionRepository;
import org.springframework.transaction.annotation.Transactional;
import com.realmcheck.backend.service.GameProgressService;
import org.springframework.stereotype.Service;
import com.realmcheck.backend.entity.User;
import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserService userService;
    private final GameProgressService gameProgressService;

    public ExamService(ExamRepository examRepository, StudySessionRepository studySessionRepository, UserService userService, GameProgressService gameProgressService) {
        this.examRepository = examRepository;
        this.studySessionRepository = studySessionRepository;
        this.userService = userService;
        this.gameProgressService = gameProgressService;
    }

    public List<Exam> getExamsByUserId(Long userId) {
        return examRepository.findByUserId(userId);
    }

    public Exam createExam(Exam exam) {
        return examRepository.save(exam);
    }

    public Exam updateExam(Exam exam) {
        return examRepository.save(exam);
    }

    public void deleteExam(Long id) {
        examRepository.deleteById(id);
    }

    public List<StudySession> getSessionsByUserId(Long userId) {
        return studySessionRepository.findByUserId(userId);
    }

    @Transactional
    public StudySession createStudySession(StudySession session) {
        StudySession saved = studySessionRepository.save(session);
        if (saved.getXpEarned() != null && saved.getXpEarned() > 0) {
            User user = userService.getUserById(saved.getUserId())
                    .orElseThrow(() -> new RuntimeException("User not found"));
            gameProgressService.addXp(user, saved.getXpEarned());
        }
        return saved;
    }
}
