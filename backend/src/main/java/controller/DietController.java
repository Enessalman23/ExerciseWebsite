package controller;

import config.CurrentUser;
import dto.request.AiDietRequest;
import dto.response.AiDietResponse;
import entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.AiDietGenerationService;
import service.DietPlanService;

import java.util.List;

@RestController
@RequestMapping("/api/diet")
@RequiredArgsConstructor
public class DietController {

    private final AiDietGenerationService aiDietGenerationService;
    private final DietPlanService dietPlanService;

    @PostMapping("/generate-plan")
    public ResponseEntity<AiDietResponse> generateDietPlan(
            @Valid @RequestBody AiDietRequest request,
            @CurrentUser User user) {

        AiDietResponse response = aiDietGenerationService.generateDiet(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-plans")
    public ResponseEntity<List<AiDietResponse>> getDietHistory(@CurrentUser User user) {
        return ResponseEntity.ok(dietPlanService.getDietHistory(user));
    }
    
    @org.springframework.web.bind.annotation.DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDietPlan(@org.springframework.web.bind.annotation.PathVariable Long id, @CurrentUser User user) {
        boolean deleted = dietPlanService.deleteDietPlan(id, user);
        if (deleted) {
            return ResponseEntity.ok("Deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Diet Plan not found or you don't have permission to delete this plan");
        }
    }
}
