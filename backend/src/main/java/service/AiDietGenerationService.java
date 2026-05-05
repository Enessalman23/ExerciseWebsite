package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dto.request.*;
import dto.response.*;
import entity.DietPlan;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import repository.DietPlanRepository;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiDietGenerationService {

    private final GeminiClientService geminiClientService;

    private final DietPlanRepository dietPlanRepository;
    private final MetricsService metricsService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiDietResponse generateDiet(AiDietRequest request, User user) {
        
        MetricsResponse metrics = metricsService.getLatestMetrics(user);
        String prompt = buildPrompt(request, metrics);

        try {
            String jsonContent = geminiClientService.generateContent(prompt, 3, true);
            JsonNode generatedPlan = objectMapper.readTree(jsonContent);
            
            int targetDailyCalories = generatedPlan.path("targetDailyCalories").asInt(0);
            int targetProtein = generatedPlan.path("targetProtein").asInt(0);
            int targetCarbs = generatedPlan.path("targetCarbs").asInt(0);
            int targetFats = generatedPlan.path("targetFats").asInt(0);

            DietPlan plan = new DietPlan();
            plan.setUser(user);
            plan.setGeneratedPlanJson(objectMapper.writeValueAsString(generatedPlan));
            plan.setTargetDailyCalories(targetDailyCalories);
            plan.setTargetProtein(targetProtein);
            plan.setTargetCarbs(targetCarbs);
            plan.setTargetFats(targetFats);
            plan.setActive(true);
            
            String assignedName = (request.getPlanName() != null && !request.getPlanName().trim().isEmpty()) 
                                    ? request.getPlanName() 
                                    : "Yeni Diyet Programı";
            plan.setPlanName(assignedName);
            
            plan = dietPlanRepository.save(plan);

            return AiDietResponse.builder()
                    .dietPlanId(plan.getId())
                    .planName(plan.getPlanName())
                    .generatedPlanJson(plan.getGeneratedPlanJson())
                    .targetDailyCalories(plan.getTargetDailyCalories())
                    .targetProtein(plan.getTargetProtein())
                    .targetCarbs(plan.getTargetCarbs())
                    .targetFats(plan.getTargetFats())
                    .createdAt(plan.getCreatedAt())
                    .message("Diet plan generated successfully!")
                    .build();

        } catch (Exception e) {
            throw new RuntimeException("Failed to process AI diet plan: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(AiDietRequest request, MetricsResponse metrics) {
        String goalText = (request.getGoal() != null && !request.getGoal().isEmpty()) 
                            ? request.getGoal() 
                            : (metrics.getGoal() != null ? metrics.getGoal().name() : "MAINTENANCE");
        
        String clinicalProtocol = "--- CLINICAL NUTRITION & SAFETY PROTOCOL ---\n" +
                                  "1. GLYCEMIC CONTROL: Prioritize complex carbohydrates (Whole grains, oats, legumes). Avoid white flour and added sugars.\n" +
                                  "2. LIPID PROFILE: Saturated fats must be <10% of total calories. Focus on monounsaturated fats (Olive oil, nuts, seeds).\n" +
                                  "3. FIBER INTAKE: Daily fiber must be 25-35g. Include high-fiber vegetables in every main meal.\n" +
                                  "4. PROTEIN QUALITY: Ensure a complete amino acid profile for muscle preservation.\n" +
                                  "5. SUSTAINABILITY: If FAT_LOSS, do not exceed a 500-kcal deficit to avoid metabolic slowdown.\n";

        String rules = "";
        String goalLower = goalText.toLowerCase();

        if (goalLower.contains("ver") || goalLower.contains("zayıf") || goalLower.contains("loss") || goalLower.contains("fat")) {
            rules = "GOAL: AGGRESSIVE FAT LOSS. \n" +
                    "Step 1: Calculate TDEE based on biometrics.\n" +
                    "Step 2: SUBTRACT exactly 500-600 kcal from TDEE.\n" +
                    "CRITICAL: The resulting 'targetDailyCalories' MUST be lower than TDEE. Typical range: 1500-1800 kcal.";
        } else if (goalLower.contains("al") || goalLower.contains("hacim") || goalLower.contains("gain") || goalLower.contains("bulk") || goalLower.contains("hypertrophy")) {
            rules = "GOAL: CLEAN BULK / WEIGHT GAIN. \n" +
                    "Step 1: Calculate TDEE based on biometrics.\n" +
                    "Step 2: ADD exactly 500-700 kcal to TDEE.\n" +
                    "CRITICAL: The resulting 'targetDailyCalories' MUST be significantly higher than TDEE. Typical range: 2800-3500 kcal.";
        } else {
            rules = "GOAL: MAINTENANCE. Use TDEE as the targetDailyCalories.";
        }

        return "You are a PhD-level Clinical Dietitian and Sports Nutrition Specialist. Create a strictly formatted JSON diet plan in Turkish.\n" +
               clinicalProtocol + "\n" +
               "--- USER BIOMETRICS ---\n" +
               "Age: " + metrics.getAge() + ", Weight: " + metrics.getWeight() + "kg, Height: " + metrics.getHeight() + "cm.\n" +
               "Gender: " + metrics.getGender() + ", Activity Level: " + metrics.getActivityLevel() + ".\n" +
               "--- DIETARY RESTRICTIONS (STRICT) ---\n" +
               "Restrictions: " + metrics.getDietaryRestrictions() + ", Allergies: " + request.getAllergies() + ".\n" +
               "--- GENERATION RULES ---\n" +
               rules + "\n" +
               "1. MEAL COUNT: " + request.getMealsPerDay() + " meals.\n" +
               "2. LOCALIZATION: Use Turkish dietary staples (Lor, Zeytinyağı, Bulgur, Kuruyemiş, Mevsim Sebzeleri).\n" +
               "3. WATER: Weight * 0.035 Liters.\n" +
               "--- JSON OUTPUT FORMAT ---\n" +
               "ONLY output valid JSON. Format exactly:\n" +
               "{ \"targetDailyCalories\": 2400, \"targetProtein\": 160, \"targetCarbs\": 250, \"targetFats\": 80, \"waterIntakeL\": 2.8, " +
               "\"meals\": [ { \"mealName\": \"Kahvaltı\", \"totalCalories\": 600, \"prepTip\": \"...\", \"items\": [ \"...\", \"...\" ] } ] }.";
    }
}
