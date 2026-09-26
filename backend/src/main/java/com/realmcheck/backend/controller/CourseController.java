package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.CourseDTO;
import com.realmcheck.backend.service.CourseService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/courses")
public class CourseController {

    private final CourseService courseService;

    public CourseController(CourseService courseService) {
        this.courseService = courseService;
    }

    @GetMapping
    public ResponseEntity<List<CourseDTO>> getAll() {
        return ResponseEntity.ok(courseService.getAllCourses());
    }

    @GetMapping("/search")
    public ResponseEntity<List<CourseDTO>> search(@RequestParam String q) {
        return ResponseEntity.ok(courseService.searchByKeyword(q));
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<CourseDTO>> byCategory(@PathVariable String category) {
        return ResponseEntity.ok(courseService.filterByCategory(category));
    }

    @GetMapping("/provider/{provider}")
    public ResponseEntity<List<CourseDTO>> byProvider(@PathVariable String provider) {
        return ResponseEntity.ok(courseService.filterByProvider(provider));
    }

    @GetMapping("/level/{level}")
    public ResponseEntity<List<CourseDTO>> byLevel(@PathVariable String level) {
        return ResponseEntity.ok(courseService.filterByLevel(level));
    }

    // Progress endpoints
    @PostMapping("/start")
    public ResponseEntity<Void> startCourse(@RequestParam Long userId, @RequestParam Long courseId) {
        courseService.startCourse(userId, courseId);
        return ResponseEntity.ok().build();
    }

    @PostMapping("/complete")
    public ResponseEntity<Void> completeCourse(@RequestParam Long userId, @RequestParam Long courseId) {
        courseService.completeCourse(userId, courseId);
        return ResponseEntity.ok().build();
    }
}
