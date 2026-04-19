package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import dto.request.AiDietRequest;
import dto.response.AiDietResponse;
import dto.response.MetricsResponse;
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
            throw new RuntimeException("Failed to process AI diet plan: " + e.getMessage(), e);
        }
    }

    private String buildPrompt(AiDietRequest request, MetricsResponse metrics) {
        return "You are a clinical dietitian and sports nutritionist. Create a strictly formatted JSON diet plan in Turkish language. \n" +
               "--- USER METRICS ---\n" +
               "Age: " + metrics.getAge() + ", Weight: " + metrics.getWeight() + "kg, Height: " + metrics.getHeight() + "cm.\n" +
               "Gender: " + metrics.getGender() + ", Activity Level: " + metrics.getActivityLevel() + ", Goal: " + metrics.getGoal() + ".\n" +
               "Restrictions: " + metrics.getDietaryRestrictions() + ". Meals/day: " + request.getMealsPerDay() + ".\n" +
               "--- DIETETIC RULES ---\n" +
               "1. Calories: Use Harris-Benedict + Activity Multiplier. For 'Kilo Verme' subtract 500. For 'Kilo Alma' add 500.\n" +
               "2. Macros (g/kg):\n" +
               "   - Kilo Verme: 2.2g Protein/kg, 0.7g Fat/kg, rest Carbs.\n" +
               "   - Kilo Alma: 1.8g Protein/kg, 0.9g Fat/kg, rest Carbs.\n" +
               "3. Water Intake: Calculate daily water in Liters (Weight * 0.035). Include it in the response.\n" +
               "--- CONTENT & LOCALIZATION ---\n" +
               "1. Use ONLY native Turkish foods (e.g., Lor peyniri, Zeytinyağı, Mevsim salatası, Mercimek, Bulgur). NO Greek Yogurt or exotic berries.\n" +
               "2. IF/2-Meal Rule: If 2 meals are requested, name them '1. Öğün (Kırılış)' and '2. Öğün (Kapanış)'.\n" +
               "3. Variety: Do not repeat the same main protein source in more than 2 meals.\n" +
               "--- JSON OUTPUT FORMAT ---\n" +
               "ONLY output valid JSON without markdown formatting. Example:\n" +
               "{ \"targetDailyCalories\": 2400, \"targetProtein\": 160, \"targetCarbs\": 250, \"targetFats\": 80, \"waterIntakeL\": 2.8, " +
               "\"meals\": [ { \"mealName\": \"Kahvaltı\", \"totalCalories\": 600, \"prepTip\": \"Yumurtaları 7 dakika haşlayın, peynire zeytinyağı ekleyin.\", \"items\": [ \"2 adet haşlanmış yumurta\", \"30g lor peyniri\" ] } ] }";
    }
}
