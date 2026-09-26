package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.ExamDTO;
import com.realmcheck.backend.dto.StudySessionDTO;
import com.realmcheck.backend.entity.Exam;
import com.realmcheck.backend.entity.StudySession;
import com.realmcheck.backend.service.ExamService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/exams")
@CrossOrigin(origins = "*")
public class ExamController {

    private final ExamService examService;

    public ExamController(ExamService examService) {
        this.examService = examService;
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ExamDTO>> getExams(@PathVariable Long userId) {
        List<ExamDTO> dtos = examService.getExamsByUserId(userId).stream().map(this::toExamDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping
    public ResponseEntity<ExamDTO> createExam(@RequestBody ExamDTO dto) {
        Exam exam = toExamEntity(dto);
        Exam saved = examService.createExam(exam);
        return ResponseEntity.ok(toExamDTO(saved));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamDTO> updateExam(@PathVariable Long id, @RequestBody ExamDTO dto) {
        Exam exam = toExamEntity(dto);
        exam.setId(id);
        Exam saved = examService.updateExam(exam);
        return ResponseEntity.ok(toExamDTO(saved));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExam(@PathVariable Long id) {
        examService.deleteExam(id); // I'll add this to service
        return ResponseEntity.ok().build();
    }

    @GetMapping("/sessions/user/{userId}")
    public ResponseEntity<List<StudySessionDTO>> getSessions(@PathVariable Long userId) {
        List<StudySessionDTO> dtos = examService.getSessionsByUserId(userId).stream().map(this::toSessionDTO).collect(Collectors.toList());
        return ResponseEntity.ok(dtos);
    }

    @PostMapping("/sessions")
    public ResponseEntity<StudySessionDTO> createSession(@RequestBody StudySessionDTO dto) {
        StudySession session = toSessionEntity(dto);
        StudySession saved = examService.createStudySession(session);
        return ResponseEntity.ok(toSessionDTO(saved));
    }

    private ExamDTO toExamDTO(Exam exam) {
        ExamDTO dto = new ExamDTO();
        dto.setId(exam.getId());
        dto.setUserId(exam.getUserId());
        dto.setSubject(exam.getSubject());
        dto.setName(exam.getName());
        dto.setDate(exam.getDate());
        dto.setDifficulty(exam.getDifficulty());
        dto.setProgress(exam.getProgress());
        dto.setStatus(exam.getStatus());
        return dto;
    }

    private Exam toExamEntity(ExamDTO dto) {
        Exam exam = new Exam();
        exam.setUserId(dto.getUserId());
        exam.setSubject(dto.getSubject());
        exam.setName(dto.getName());
        exam.setDate(dto.getDate());
        exam.setDifficulty(dto.getDifficulty());
        exam.setProgress(dto.getProgress());
        exam.setStatus(dto.getStatus());
        return exam;
    }

    private StudySessionDTO toSessionDTO(StudySession session) {
        StudySessionDTO dto = new StudySessionDTO();
        dto.setId(session.getId());
        dto.setUserId(session.getUserId());
        dto.setSubject(session.getSubject());
        dto.setDurationMinutes(session.getDurationMinutes());
        dto.setXpEarned(session.getXpEarned());
        dto.setDate(session.getDate());
        return dto;
    }

    private StudySession toSessionEntity(StudySessionDTO dto) {
        StudySession session = new StudySession();
        session.setUserId(dto.getUserId());
        session.setSubject(dto.getSubject());
        session.setDurationMinutes(dto.getDurationMinutes());
        session.setXpEarned(dto.getXpEarned());
        return session;
    }
}
