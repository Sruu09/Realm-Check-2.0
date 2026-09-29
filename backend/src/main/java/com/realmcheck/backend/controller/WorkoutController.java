package com.realmcheck.backend.controller;

import com.realmcheck.backend.dto.WorkoutDTO;
import com.realmcheck.backend.service.WorkoutService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@CrossOrigin(origins = "*")
public class WorkoutController {

    private final WorkoutService workoutService;

    public WorkoutController(WorkoutService workoutService) {
        this.workoutService = workoutService;
    }

    // GET workouts for a specific user
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<WorkoutDTO>> getWorkouts(@PathVariable Long userId) {
        List<WorkoutDTO> dtos = workoutService.getWorkoutsForUser(userId);
        return ResponseEntity.ok(dtos);
    }

    // POST a new workout (client must include userId in payload)
    @PostMapping
    public ResponseEntity<WorkoutDTO> createWorkout(@RequestBody WorkoutDTO dto) {
        // Assume dto contains userId; service validates match
        WorkoutDTO saved = workoutService.createWorkout(dto, dto.getUserId());
        return ResponseEntity.ok(saved);
    }

    // Toggle completion status
    @PutMapping("/{id}/toggle")
    public ResponseEntity<WorkoutDTO> toggleWorkout(@PathVariable("id") Long workoutId,
                                                    @RequestParam Long userId) {
        WorkoutDTO updated = workoutService.toggleWorkout(workoutId, userId);
        return ResponseEntity.ok(updated);
    }
}
