package controller;

import config.CurrentUser;
import dto.request.AiWorkoutRequest;
import dto.response.AiWorkoutResponse;
import entity.User;
import entity.WorkoutPlan;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import repository.WorkoutPlanRepository;
import service.AiCoachService;
import service.AiGenerationService;
import service.NutritionService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiGenerationService aiGenerationService;
    private final AiCoachService aiCoachService;
    private final NutritionService nutritionService;
    private final WorkoutPlanRepository workoutPlanRepository;

    @PostMapping("/generate-workout")
    public ResponseEntity<AiWorkoutResponse> generateWorkout(@Valid @RequestBody AiWorkoutRequest request,
            @CurrentUser User user) {

        AiWorkoutResponse response = aiGenerationService.generateWorkout(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-workouts")
    public ResponseEntity<List<AiWorkoutResponse>> getWorkoutHistory(@CurrentUser User user) {
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserOrderByCreatedAtDesc(user);

        List<AiWorkoutResponse> response = plans.stream()
                .map(plan -> new AiWorkoutResponse(plan.getId(), plan.getGeneratedPlanJson(), "Plan retrieved",
                        plan.getPlanName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/workout/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable Long id, @CurrentUser User user) {
        return workoutPlanRepository.findById(id)
                .map(plan -> {
                    if (!plan.getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Unauthorized to delete this plan");
                    }
                    workoutPlanRepository.delete(plan);
                    return ResponseEntity.ok("Workout plan deleted successfully");
                })
                .orElse(ResponseEntity.status(404).body("Plan not found"));
    }

    @PostMapping("/coach")
    public ResponseEntity<Map<String, String>> getCoachResponse(
            @RequestBody Map<String, String> request,
            @CurrentUser User user) {

        String userMessage = request.get("message");
        String coachResponse = aiCoachService.getCoachResponse(userMessage, user);

        return ResponseEntity.ok(Map.of("response", coachResponse));
    }

    @PostMapping("/nutrition-analyze")
    public ResponseEntity<Map<String, Object>> analyzeFood(
            @RequestBody Map<String, String> request) {

        String query = request.get("query");
        if (query == null || query.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Sorgu boş olamaz"));
        }

        Map<String, Object> analysis = nutritionService.analyzeFood(query);
        return ResponseEntity.ok(analysis);
    }
}
