package com.realmcheck.backend.service;

import com.realmcheck.backend.dto.WorkoutDTO;
import com.realmcheck.backend.entity.Workout;
import com.realmcheck.backend.repository.WorkoutRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class WorkoutService {

    private final WorkoutRepository workoutRepository;
    private final UserService userService;

    public WorkoutService(WorkoutRepository workoutRepository, UserService userService) {
        this.workoutRepository = workoutRepository;
        this.userService = userService;
    }

    public List<WorkoutDTO> getWorkoutsForUser(Long userId) {
        List<Workout> workouts = workoutRepository.findByUserId(userId);
        return workouts.stream().map(this::toDTO).collect(Collectors.toList());
    }

    @Transactional
    public WorkoutDTO createWorkout(WorkoutDTO dto, Long userId) {
        if (!dto.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User ID mismatch");
        }
        Workout workout = toEntity(dto);
        Workout saved = workoutRepository.save(workout);
        return toDTO(saved);
    }

    @Transactional
    public WorkoutDTO toggleWorkout(Long workoutId, Long userId) {
        Workout workout = workoutRepository.findById(workoutId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Workout not found"));
        if (!workout.getUserId().equals(userId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot modify another user's workout");
        }
        workout.setCompleted(!Boolean.TRUE.equals(workout.getCompleted()));
        Workout saved = workoutRepository.save(workout);
        return toDTO(saved);
    }

    private WorkoutDTO toDTO(Workout w) {
        WorkoutDTO dto = new WorkoutDTO();
        dto.setId(w.getId());
        dto.setUserId(w.getUserId());
        dto.setName(w.getName());
        dto.setDuration(w.getDuration());
        dto.setDate(w.getDate());
        dto.setCompleted(w.getCompleted());
        return dto;
    }

    private Workout toEntity(WorkoutDTO dto) {
        Workout w = new Workout();
        w.setUserId(dto.getUserId());
        w.setName(dto.getName());
        w.setDuration(dto.getDuration());
        w.setDate(dto.getDate());
        w.setCompleted(dto.getCompleted() != null ? dto.getCompleted() : false);
        return w;
    }
}
