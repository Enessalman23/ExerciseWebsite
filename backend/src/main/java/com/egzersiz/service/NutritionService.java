package com.egzersiz.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class NutritionService {

    private final GeminiClientService geminiClientService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public Map<String, Object> analyzeFood(String query) {
        String systemPrompt = "You are a nutrition expert. Analyze the following food query and provide accurate nutritional information (calories, protein, carbs, fats, sodium in mg, potassium in mg, calcium in mg, caffeine in mg, vitaminC in mg, iron in mg). " +
                "The user might provide the amount in units, grams, or descriptions. " +
                "Respond ONLY with a valid JSON object in this format: " +
                "{\"foodName\": \"...\", \"calories\": 0, \"protein\": 0, \"carbs\": 0, \"fats\": 0, \"sodium\": 0, \"potassium\": 0, \"calcium\": 0, \"caffeine\": 0, \"vitaminC\": 0, \"iron\": 0}. " +
                "Use numbers for nutrients. If unsure, provide the best estimate based on standard nutritional data. " +
                "Use Turkish for the foodName if the query is in Turkish.";

        try {
            String fullPrompt = systemPrompt + "\n\nFood Query: " + query;
            String jsonContent = geminiClientService.generateContent(fullPrompt, 3, true);
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            log.error("Nutrition Analysis Failed: ", e);
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("foodName", query);
            fallback.put("calories", 0);
            fallback.put("protein", 0);
            fallback.put("carbs", 0);
            fallback.put("fats", 0);
            fallback.put("sodium", 0);
            fallback.put("potassium", 0);
            fallback.put("calcium", 0);
            fallback.put("caffeine", 0);
            fallback.put("vitaminC", 0);
            fallback.put("iron", 0);
            fallback.put("error", "Analiz başarısız oldu.");
            return fallback;
        }
    }

    public Map<String, Object> analyzeFoodImage(String mimeType, String base64Data) {
        String systemPrompt = "You are a nutrition expert with advanced vision capabilities. " +
                "Analyze the provided image of a meal/food. Identify the food item(s) present, " +
                "estimate their portion sizes, and calculate accurate nutritional information " +
                "(calories, protein, carbs, fats, sodium in mg, potassium in mg, calcium in mg, caffeine in mg, vitaminC in mg, iron in mg). " +
                "Respond ONLY with a valid JSON object in this format: " +
                "{\"foodName\": \"...\", \"calories\": 0, \"protein\": 0, \"carbs\": 0, \"fats\": 0, \"sodium\": 0, \"potassium\": 0, \"calcium\": 0, \"caffeine\": 0, \"vitaminC\": 0, \"iron\": 0}. " +
                "Use numbers for nutrients. If unsure, provide the best estimate based on standard nutritional data. " +
                "Use Turkish for the foodName (e.g., \"Izgara Tavuk ve Pilav\").";

        try {
            String jsonContent = geminiClientService.generateContentWithImage(systemPrompt, mimeType, base64Data, 3, true);
            return objectMapper.readValue(jsonContent, Map.class);
        } catch (Exception e) {
            log.error("Nutrition Vision Analysis Failed: ", e);
            Map<String, Object> fallback = new HashMap<>();
            fallback.put("foodName", "Bilinmeyen Yemek");
            fallback.put("calories", 0);
            fallback.put("protein", 0);
            fallback.put("carbs", 0);
            fallback.put("fats", 0);
            fallback.put("sodium", 0);
            fallback.put("potassium", 0);
            fallback.put("calcium", 0);
            fallback.put("caffeine", 0);
            fallback.put("vitaminC", 0);
            fallback.put("iron", 0);
            fallback.put("error", "Görsel analizi başarısız oldu.");
            return fallback;
        }
    }
}
