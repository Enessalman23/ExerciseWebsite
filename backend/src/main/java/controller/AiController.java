package controller;

import dto.request.AiWorkoutRequest;
import dto.response.AiWorkoutResponse;
import entity.User;
import entity.WorkoutPlan;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import repository.UserRepository;
import repository.WorkoutPlanRepository;
import service.AiCoachService;
import service.AiGenerationService;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
public class AiController {

    private final AiGenerationService aiGenerationService;
    private final AiCoachService aiCoachService;
    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutPlanRepository;

    @PostMapping("/generate-workout")
    public ResponseEntity<AiWorkoutResponse> generateWorkout(
            @Valid @RequestBody AiWorkoutRequest request,
            Authentication authentication) {
            
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
                
        AiWorkoutResponse response = aiGenerationService.generateWorkout(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-workouts")
    public ResponseEntity<List<AiWorkoutResponse>> getWorkoutHistory(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<WorkoutPlan> plans = workoutPlanRepository.findByUserOrderByCreatedAtDesc(user);
        
        List<AiWorkoutResponse> response = plans.stream()
                .map(plan -> new AiWorkoutResponse(plan.getId(), plan.getGeneratedPlanJson(), "Plan retrieved", plan.getPlanName()))
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/workout/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        WorkoutPlan plan = workoutPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Plan not found: " + id));

        if (!plan.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Unauthorized to delete this plan");
        }

        workoutPlanRepository.delete(plan);
        return ResponseEntity.ok("Workout plan deleted successfully");
    }

    @PostMapping("/coach")
    public ResponseEntity<Map<String, String>> getCoachResponse(
            @RequestBody Map<String, String> request,
            Authentication authentication) {
            
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
                
        String userMessage = request.get("message");
        String coachResponse = aiCoachService.getCoachResponse(userMessage, user);
        
        return ResponseEntity.ok(Map.of("response", coachResponse));
    }
}
