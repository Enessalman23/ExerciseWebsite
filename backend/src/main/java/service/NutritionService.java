package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class NutritionService {

    private final GeminiClientService geminiClientService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> analyzeFood(String query) {
        String systemPrompt = "You are a nutrition expert. Analyze the following food query and provide accurate nutritional information (calories, protein, carbs, fats). " +
                "The user might provide the amount in units, grams, or descriptions. " +
                "Respond ONLY with a valid JSON object in this format: " +
                "{\"foodName\": \"...\", \"calories\": 0, \"protein\": 0, \"carbs\": 0, \"fats\": 0}. " +
                "Use numbers for nutrients. If unsure, provide the best estimate based on standard nutritional data. " +
                "Use Turkish for the foodName if the query is in Turkish.";

        try {
            String fullPrompt = systemPrompt + "\n\nFood Query: " + query;
            String jsonContent = geminiClientService.generateContent(fullPrompt, 3, true);
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            System.err.println("Nutrition Analysis Failed: " + e.getMessage());
            return Map.of(
                "foodName", query,
                "calories", 0,
                "protein", 0,
                "carbs", 0,
                "fats", 0,
                "error", "Analiz başarısız oldu."
            );
        }
    }
}
