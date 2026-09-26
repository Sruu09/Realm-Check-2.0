package com.realmcheck.backend.service;

import com.realmcheck.backend.dto.CourseDTO;
import com.realmcheck.backend.entity.Course;
import com.realmcheck.backend.entity.CourseProgress;
import com.realmcheck.backend.repository.CourseProgressRepository;
import com.realmcheck.backend.repository.CourseRepository;
import com.realmcheck.backend.service.UserService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CourseService {

    private final CourseRepository courseRepository;
    private final CourseProgressRepository progressRepository;
    private final UserService userService;

    public CourseService(CourseRepository courseRepository,
                         CourseProgressRepository progressRepository,
                         UserService userService) {
        this.courseRepository = courseRepository;
        this.progressRepository = progressRepository;
        this.userService = userService;
    }

    // ---------- Retrieval ----------
    public List<CourseDTO> getAllCourses() {
        return courseRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> searchByKeyword(String keyword) {
        return courseRepository.findByTitleContainingIgnoreCase(keyword).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> filterByCategory(String category) {
        return courseRepository.findByCategoryIgnoreCase(category).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> filterByProvider(String provider) {
        return courseRepository.findByProviderIgnoreCase(provider).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public List<CourseDTO> filterByLevel(String level) {
        return courseRepository.findByLevelIgnoreCase(level).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    // ---------- Progress ----------
    @Transactional
    public void startCourse(Long userId, Long courseId) {
        // ensure Course exists
        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));
        // create or fetch progress
        Optional<CourseProgress> opt = progressRepository.findByUserIdAndCourseId(userId, courseId);
        if (opt.isEmpty()) {
            CourseProgress cp = new CourseProgress(userId, courseId, "STARTED");
            progressRepository.save(cp);
        }
        // else already started – do nothing
    }

    @Transactional
    public void completeCourse(Long userId, Long courseId) {
        CourseProgress cp = progressRepository.findByUserIdAndCourseId(userId, courseId)
                .orElseThrow(() -> new RuntimeException("Course not started"));
        if ("COMPLETED".equals(cp.getStatus())) {
            return; // already completed
        }
        cp.setStatus("COMPLETED");
        cp.setCompletedAt(java.time.LocalDateTime.now());
        // award XP only once
        if (!Boolean.TRUE.equals(cp.getXpAwarded())) {
            // simplistic XP award: 100 points per course
            userService.addXpAndGold(userId, 100, 0);
            cp.setXpAwarded(true);
        }
        progressRepository.save(cp);
    }

    // ---------- Helper ----------
    private CourseDTO toDto(Course c) {
        CourseDTO dto = new CourseDTO();
        dto.setId(c.getId());
        dto.setTitle(c.getTitle());
        dto.setCategory(c.getCategory());
        dto.setDescription(c.getDescription());
        dto.setLevel(c.getLevel());
        dto.setDuration(c.getDuration());
        dto.setProvider(c.getProvider());
        dto.setUrl(c.getUrl());
        dto.setType(c.getType());
        dto.setTags(c.getTags());
        return dto;
    }
}
