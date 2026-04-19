package controller;

import dto.request.AiDietRequest;
import dto.response.AiDietResponse;
import entity.DietPlan;
import entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import repository.DietPlanRepository;
import repository.UserRepository;
import service.AiDietGenerationService;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {

    private final AiDietGenerationService aiDietGenerationService;
    private final UserRepository userRepository;
    private final DietPlanRepository dietPlanRepository;

    @PostMapping("/generate-plan")
    public ResponseEntity<AiDietResponse> generateDietPlan(
            @Valid @RequestBody AiDietRequest request,
            Authentication authentication) {

        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        AiDietResponse response = aiDietGenerationService.generateDiet(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-plans")
    public ResponseEntity<List<AiDietResponse>> getDietHistory(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        List<DietPlan> plans = dietPlanRepository.findByUserOrderByCreatedAtDesc(user);

        List<AiDietResponse> response = plans.stream()
                .map(plan -> AiDietResponse.builder()
                        .dietPlanId(plan.getId())
                        .planName(plan.getPlanName() != null ? plan.getPlanName() : "Diyet Planı")
                        .generatedPlanJson(plan.getGeneratedPlanJson())
                        .targetDailyCalories(plan.getTargetDailyCalories())
                        .targetProtein(plan.getTargetProtein())
                        .targetCarbs(plan.getTargetCarbs())
                        .targetFats(plan.getTargetFats())
                        .createdAt(plan.getCreatedAt())
                        .message("Diet plan retrieved successfully!")
                        .build())
                .collect(Collectors.toList());

        return ResponseEntity.ok(response);
    }
    
    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDietPlan(@org.springframework.web.bind.annotation.PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));
                
        DietPlan plan = dietPlanRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Diet Plan not found"));
                
        if (!plan.getUser().getId().equals(user.getId())) {
             return ResponseEntity.status(403).body("You don't have permission to delete this plan");
        }
        
        dietPlanRepository.delete(plan);
        return ResponseEntity.ok("Deleted successfully");
    }
}
