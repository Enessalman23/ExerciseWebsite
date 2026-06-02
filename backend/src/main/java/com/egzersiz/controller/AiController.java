package com.egzersiz.controller;

import com.egzersiz.config.CurrentUser;
import com.egzersiz.dto.request.AiWorkoutRequest;
import com.egzersiz.dto.response.AiWorkoutResponse;
import com.egzersiz.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.egzersiz.service.AiCoachService;
import com.egzersiz.service.AiGenerationService;
import com.egzersiz.service.NutritionService;
import com.egzersiz.service.WorkoutPlanService;
import java.util.List;
import java.util.Map;

import com.egzersiz.service.AiFeedbackService;
import com.egzersiz.service.AiRecipeService;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import java.util.Base64;

@RestController
@RequestMapping("/api/ai")
@RequiredArgsConstructor
@Slf4j
public class AiController {

    private final AiGenerationService aiGenerationService;
    private final AiCoachService aiCoachService;
    private final NutritionService nutritionService;
    private final WorkoutPlanService workoutPlanService;
    private final AiRecipeService aiRecipeService;
    private final AiFeedbackService aiFeedbackService;

    @PostMapping("/generate-workout")
    public ResponseEntity<AiWorkoutResponse> generateWorkout(@Valid @RequestBody AiWorkoutRequest request,
            @CurrentUser User user) {

        AiWorkoutResponse response = aiGenerationService.generateWorkout(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping("/my-workouts")
    public ResponseEntity<List<AiWorkoutResponse>> getWorkoutHistory(@CurrentUser User user) {
        return ResponseEntity.ok(workoutPlanService.getAiWorkoutHistory(user));
    }

    @DeleteMapping("/workout/{id}")
    public ResponseEntity<?> deleteWorkout(@PathVariable Long id, @CurrentUser User user) {
        boolean deleted = workoutPlanService.deleteWorkout(id, user);
        if (deleted) {
            return ResponseEntity.ok("Workout plan deleted successfully");
        } else {
            return ResponseEntity.status(404).body("Plan not found or unauthorized");
        }
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

    @PostMapping("/recipe")
    public ResponseEntity<Map<String, String>> generateRecipe(
            @RequestBody Map<String, String> request,
            @CurrentUser User user) {
        String ingredients = request.get("ingredients");
        if (ingredients == null || ingredients.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Malzemeler boş olamaz."));
        }
        String recipe = aiRecipeService.generateRecipe(ingredients, user);
        return ResponseEntity.ok(Map.of("recipe", recipe));
    }

    @PostMapping("/workout-feedback")
    public ResponseEntity<Map<String, String>> getWorkoutFeedback(
            @RequestBody Map<String, Object> request,
            @CurrentUser User user) {
        try {
            int rpe = Integer.parseInt(request.getOrDefault("rpe", "5").toString());
            String dayName = request.getOrDefault("dayName", "Antrenman").toString();
            String feedback = aiFeedbackService.generateWorkoutFeedback(rpe, dayName, user);
            return ResponseEntity.ok(Map.of("feedback", feedback));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("error", "Geçersiz parametreler"));
        }
    }

    @PostMapping("/nutrition-analyze-image")
    public ResponseEntity<Map<String, Object>> analyzeFoodImage(
            @RequestParam("image") MultipartFile file) {
        if (file == null || file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Dosya boş olamaz"));
        }
        try {
            String mimeType = file.getContentType();
            if (mimeType == null || !mimeType.startsWith("image/")) {
                return ResponseEntity.badRequest().body(Map.of("error", "Lütfen geçerli bir resim dosyası yükleyin"));
            }
            byte[] bytes = file.getBytes();
            String base64Data = Base64.getEncoder().encodeToString(bytes);
            Map<String, Object> analysis = nutritionService.analyzeFoodImage(mimeType, base64Data);
            return ResponseEntity.ok(analysis);
        } catch (Exception e) {
            log.error("Error processing uploaded food image: ", e);
            return ResponseEntity.status(500).body(Map.of("error", "Resim işlenirken hata oluştu"));
        }
    }
}
