package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dto.request.*;
import dto.response.*;
import entity.DietPlan;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import repository.DietPlanRepository;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiDietGenerationService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final DietPlanRepository dietPlanRepository;
    private final MetricsService metricsService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public AiDietResponse generateDiet(AiDietRequest request, User user) {
        
        MetricsResponse metrics = metricsService.getLatestMetrics(user);
        String prompt = buildPrompt(request, metrics);

        String geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        int maxRetries = 3;
        int retryCount = 0;
        Exception lastException = null;

        while (retryCount < maxRetries) {
            try {
                HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);
                String responseStr = restTemplate.postForObject(geminiEndpoint, httpEntity, String.class);
                JsonNode root = objectMapper.readTree(responseStr);
                String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

                aiText = aiText.replaceAll("(?s)```json(.*?)```", "$1").trim();
                aiText = aiText.replaceAll("(?s)```(.*?)```", "$1").trim();

                JsonNode generatedPlan = objectMapper.readTree(aiText);
                
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
                lastException = e;
                retryCount++;
                System.err.println("AI Diet attempt " + retryCount + " failed: " + e.getMessage());
                if (retryCount < maxRetries) {
                    try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
                }
            }
        }
        throw new RuntimeException("Failed to process AI diet plan after " + maxRetries + " attempts. Last error: " + lastException.getMessage(), lastException);
    }

    private String buildPrompt(AiDietRequest request, MetricsResponse metrics) {
        String goalText = metrics.getGoal() != null ? metrics.getGoal().name() : "MAINTENANCE";
        String rules = "";
        
        if ("FAT_LOSS".equalsIgnoreCase(goalText)) {
            rules = "Goal: WEIGHT LOSS. Calories: Calculate TDEE and subtract 500. Macros: 2.2g Protein/kg, 0.7g Fat/kg, rest Carbs.";
        } else if ("HYPERTROPHY".equalsIgnoreCase(goalText) || "STRENGTH".equalsIgnoreCase(goalText)) {
            rules = "Goal: MUSCLE GAIN / BULK. Calories: Calculate TDEE and add 400-500. Macros: 1.8g Protein/kg, 0.9g Fat/kg, rest Carbs.";
        } else {
            rules = "Goal: MAINTENANCE / HEALTH. Calories: Use TDEE. Macros: 1.6g Protein/kg, 0.8g Fat/kg, rest Carbs.";
        }

        return "You are a world-class clinical dietitian and sports nutritionist. Create a strictly formatted JSON diet plan in Turkish language. \n" +
               "--- USER DATA ---\n" +
               "Age: " + metrics.getAge() + ", Weight: " + metrics.getWeight() + "kg, Height: " + metrics.getHeight() + "cm.\n" +
               "Gender: " + metrics.getGender() + ", Activity Level: " + metrics.getActivityLevel() + ".\n" +
               "Dietary Restrictions (CRITICAL): " + metrics.getDietaryRestrictions() + ", Additional Info: " + request.getAllergies() + ".\n" +
               "Meals per day: " + request.getMealsPerDay() + ".\n" +
               "--- DIETETIC GUIDELINES ---\n" +
               rules + "\n" +
               "Water Intake: Calculate Weight * 0.035 in Liters.\n" +
               "--- CONTENT RULES ---\n" +
               "1. CRITICAL: If any 'Dietary Restrictions' are provided, YOU MUST NOT INCLUDE those ingredients. (e.g. if allergy to eggs, NO EGGS).\n" +
               "2. Localization: Use native Turkish foods (Lor, Zeytinyağı, Mercimek, Bulgur, Mevsim sebzeleri). No exotic ingredients.\n" +
               "3. IF/2-Meal Rule: If 2 meals are requested, name them '1. Öğün (Kırılış)' and '2. Öğün (Kapanış)'.\n" +
               "--- JSON OUTPUT FORMAT ---\n" +
               "ONLY output valid JSON. No markdown. No comments. Example structure:\n" +
               "{ \"targetDailyCalories\": 2400, \"targetProtein\": 160, \"targetCarbs\": 250, \"targetFats\": 80, \"waterIntakeL\": 2.8, " +
               "\"meals\": [ { \"mealName\": \"Kahvaltı\", \"totalCalories\": 600, \"prepTip\": \"...\", \"items\": [ \"...\", \"...\" ] } ] }";
    }
}
