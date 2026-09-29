package com.realmcheck.backend.controller;

import com.realmcheck.backend.service.BodhDishaService;
import com.realmcheck.backend.service.ApifyService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;

@RestController
@RequestMapping("/api/education")
@CrossOrigin(origins = "*", maxAge = 3600)
public class EducationController {

    @Autowired
    private BodhDishaService bodhDishaService;

    @Autowired
    private ApifyService apifyService;

    @GetMapping("/scholarships")
    public ResponseEntity<Object> getScholarships() {
        return ResponseEntity.ok(bodhDishaService.getScholarships());
    }

    @GetMapping("/exams")
    public ResponseEntity<Object> getExams() {
        return ResponseEntity.ok(bodhDishaService.getExams());
    }

    @GetMapping("/colleges")
    public ResponseEntity<Object> getColleges() {
        return ResponseEntity.ok(bodhDishaService.getColleges());
    }

    @GetMapping("/universities")
    public ResponseEntity<Object> getUniversities() {
        return ResponseEntity.ok(bodhDishaService.getUniversities());
    }

    @GetMapping("/courses")
    public ResponseEntity<Object> getCourses(@RequestParam String search) {
        return ResponseEntity.ok(apifyService.searchCourses(search));
    }
}
