package controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.ExerciseService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/exercises")
@RequiredArgsConstructor
public class ExerciseController {

    private final ExerciseService exerciseService;

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getExercisesByMuscle(@RequestParam String muscle) {
        List<Map<String, Object>> exercises = exerciseService.getExercisesByMuscle(muscle);
        return ResponseEntity.ok(exercises);
    }
}
