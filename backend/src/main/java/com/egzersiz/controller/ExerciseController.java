package com.egzersiz.controller;

import com.egzersiz.dto.ExerciseDataDto;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.egzersiz.service.ExerciseService;

import java.util.List;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<List<ExerciseDataDto>> getExercisesByMuscle(@RequestParam String muscle) {
        List<ExerciseDataDto> exercises = exerciseService.getExercisesByMuscle(muscle);
        return ResponseEntity.ok(exercises);
    }
}
