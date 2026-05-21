package controller;

import config.CurrentUser;
import dto.response.WorkoutHistoryResponse;
import entity.User;
import entity.WorkoutPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import repository.WorkoutPlanRepository;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/workouts")
@RequiredArgsConstructor
public class WorkoutController {

    private final WorkoutPlanRepository workoutPlanRepository;

    @GetMapping("/history")
    public ResponseEntity<List<WorkoutHistoryResponse>> getWorkoutHistory(@CurrentUser User user) {
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserOrderByCreatedAtDesc(user);

        List<WorkoutHistoryResponse> response = plans.stream()
                .map(plan -> new WorkoutHistoryResponse(
                        plan.getCreatedAt() != null ? plan.getCreatedAt().toString() : java.time.LocalDateTime.now().toString(),
                        plan.getGeneratedPlanJson()
                ))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
}
