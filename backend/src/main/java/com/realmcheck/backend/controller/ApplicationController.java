package com.realmcheck.backend.controller;

import com.realmcheck.backend.entity.JobApplication;
import com.realmcheck.backend.repository.JobApplicationRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@CrossOrigin(origins = "*")
public class ApplicationController {

    @Autowired
    private JobApplicationRepository applicationRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<JobApplication>> getApplications(@PathVariable Long userId) {
        return ResponseEntity.ok(applicationRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<JobApplication> createApplication(@RequestBody JobApplication app) {
        return ResponseEntity.ok(applicationRepository.save(app));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<JobApplication> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return applicationRepository.findById(id).map(app -> {
            app.setStatus(status);
            return ResponseEntity.ok(applicationRepository.save(app));
        }).orElse(ResponseEntity.notFound().build());
    }
}
