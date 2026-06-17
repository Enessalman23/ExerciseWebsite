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

    private boolean isBarcode(String query) {
        if (query == null) return false;
        String trimmed = query.trim();
        return trimmed.matches("\\d{8,14}");
    }

    private Map<String, Object> fetchFromOpenFoodFacts(String barcode) {
        String url = "https://world.openfoodfacts.org/api/v2/product/" + barcode.trim() + ".json";
        try {
            java.net.http.HttpClient client = java.net.http.HttpClient.newHttpClient();
            java.net.http.HttpRequest httpRequest = java.net.http.HttpRequest.newBuilder()
                    .uri(java.net.URI.create(url))
                    .header("User-Agent", "FitnessAI-EgzersizApp/1.0 (Java HttpClient)")
                    .GET()
                    .build();

            java.net.http.HttpResponse<String> httpResponse = client.send(httpRequest, java.net.http.HttpResponse.BodyHandlers.ofString());

            if (httpResponse.statusCode() == 200) {
                JsonNode root = objectMapper.readTree(httpResponse.body());
                if (root.has("status") && root.get("status").asInt() == 1 && root.has("product")) {
                    JsonNode product = root.get("product");
                    
                    String name = product.has("product_name_tr") && !product.get("product_name_tr").asText().isEmpty()
                            ? product.get("product_name_tr").asText()
                            : (product.has("product_name") ? product.get("product_name").asText() : "Barkodlu Ürün (" + barcode + ")");

                    JsonNode nutriments = product.get("nutriments");
                    
                    Map<String, Object> result = new HashMap<>();
                    result.put("foodName", name + " (100g)");
                    result.put("calories", getNutrientValue(nutriments, "energy-kcal_100g"));
                    result.put("protein", getNutrientValue(nutriments, "proteins_100g"));
                    result.put("carbs", getNutrientValue(nutriments, "carbohydrates_100g"));
                    result.put("fats", getNutrientValue(nutriments, "fat_100g"));
                    
                    // Sodium: database is in grams, we need mg
                    double sodiumGrams = getNutrientValueDouble(nutriments, "sodium_100g");
                    result.put("sodium", (int) Math.round(sodiumGrams * 1000));
                    
                    // Other micros in mg
                    result.put("potassium", (int) Math.round(getNutrientValueDouble(nutriments, "potassium_100g") * 1000));
                    result.put("calcium", (int) Math.round(getNutrientValueDouble(nutriments, "calcium_100g") * 1000));
                    result.put("caffeine", (int) Math.round(getNutrientValueDouble(nutriments, "caffeine_100g") * 1000));
                    result.put("vitaminC", (int) Math.round(getNutrientValueDouble(nutriments, "vitamin-c_100g") * 1000));
                    result.put("iron", (int) Math.round(getNutrientValueDouble(nutriments, "iron_100g") * 1000));
                    
                    return result;
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch barcode info from Open Food Facts API: ", e);
        }
        return null;
    }

    private int getNutrientValue(JsonNode nutriments, String key) {
        if (nutriments != null && nutriments.has(key)) {
            return (int) Math.round(nutriments.get(key).asDouble());
        }
        return 0;
    }

    private double getNutrientValueDouble(JsonNode nutriments, String key) {
        if (nutriments != null && nutriments.has(key)) {
            return nutriments.get(key).asDouble();
        }
        return 0.0;
    }

    public Map<String, Object> analyzeFood(String query) {
        if (isBarcode(query)) {
            Map<String, Object> offResult = fetchFromOpenFoodFacts(query);
            if (offResult != null) {
                return offResult;
            }
        }
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
