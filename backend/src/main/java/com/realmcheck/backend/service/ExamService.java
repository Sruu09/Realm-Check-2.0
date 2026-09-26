package com.realmcheck.backend.service;

import com.realmcheck.backend.entity.Exam;
import com.realmcheck.backend.entity.StudySession;
import com.realmcheck.backend.repository.ExamRepository;
import com.realmcheck.backend.repository.StudySessionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ExamService {

    private final ExamRepository examRepository;
    private final StudySessionRepository studySessionRepository;
    private final UserService userService;

    public ExamService(ExamRepository examRepository, StudySessionRepository studySessionRepository, UserService userService) {
        this.examRepository = examRepository;
        this.studySessionRepository = studySessionRepository;
        this.userService = userService;
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
            userService.addXpAndGold(saved.getUserId(), saved.getXpEarned(), 0);
        }
        return saved;
    }
}
