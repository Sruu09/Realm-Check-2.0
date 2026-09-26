package com.realmcheck.backend.controller;

import com.realmcheck.backend.entity.SavedJob;
import com.realmcheck.backend.repository.SavedJobRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/saved-jobs")
@CrossOrigin(origins = "*")
public class SavedJobController {

    @Autowired
    private SavedJobRepository savedJobRepository;

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<SavedJob>> getSavedJobs(@PathVariable Long userId) {
        return ResponseEntity.ok(savedJobRepository.findByUserId(userId));
    }

    @PostMapping
    public ResponseEntity<SavedJob> saveJob(@RequestBody SavedJob job) {
        return ResponseEntity.ok(savedJobRepository.save(job));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteJob(@PathVariable Long id) {
        savedJobRepository.deleteById(id);
        return ResponseEntity.ok().build();
    }
}
