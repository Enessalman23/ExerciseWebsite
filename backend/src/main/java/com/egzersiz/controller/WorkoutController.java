package com.egzersiz.controller;

import com.egzersiz.config.CurrentUser;
import com.egzersiz.dto.response.WorkoutHistoryResponse;
import com.egzersiz.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.egzersiz.service.WorkoutPlanService;

import java.util.List;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutPlanService workoutPlanService;

    @GetMapping("/history")
    public ResponseEntity<List<WorkoutHistoryResponse>> getWorkoutHistory(@CurrentUser User user) {
        return ResponseEntity.ok(workoutPlanService.getWorkoutHistory(user));
    }
}
