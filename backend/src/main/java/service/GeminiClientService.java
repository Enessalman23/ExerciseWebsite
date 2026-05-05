package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GeminiClientService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final ObjectMapper objectMapper = new ObjectMapper();
    private final RestTemplate restTemplate = new RestTemplate();

    public String generateContent(String prompt, int maxRetries, boolean expectJson) {
        String geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("parts", List.of(
                    Map.of("text", prompt)
                ))
            )
        );

        int retryCount = 0;
        Exception lastException = null;

        while (retryCount < maxRetries) {
            try {
                HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);
                String responseStr = restTemplate.postForObject(geminiEndpoint, httpEntity, String.class);
                
                JsonNode root = objectMapper.readTree(responseStr);
                String aiText = root.path("candidates").get(0).path("content").path("parts").get(0).path("text").asText();

                if (expectJson) {
                    return extractJson(aiText);
                }
                return aiText;

            } catch (Exception e) {
                lastException = e;
                retryCount++;
                System.err.println("Gemini API attempt " + retryCount + " failed: " + e.getMessage());
                if (retryCount < maxRetries) {
                    try { Thread.sleep(2000); } catch (InterruptedException ignored) {}
                }
            }
        }
        
        throw new RuntimeException("Failed to get response from Gemini API after " + maxRetries + " attempts. Last error: " + (lastException != null ? lastException.getMessage() : "Unknown"));
    }

    private String extractJson(String text) {
        // Remove markdown code blocks if present
        String cleanedText = text.replaceAll("(?s)```json(.*?)```", "$1").trim();
        cleanedText = cleanedText.replaceAll("(?s)```(.*?)```", "$1").trim();

        // Find the first '{' or '[' and the last '}' or ']'
        int firstBrace = cleanedText.indexOf('{');
        int lastBrace = cleanedText.lastIndexOf('}');
        
        int firstBracket = cleanedText.indexOf('[');
        int lastBracket = cleanedText.lastIndexOf(']');
        
        // Determine if it's a JSON Object or Array
        int startObj = firstBrace;
        int endObj = lastBrace;
        
        if (firstBrace == -1 && firstBracket != -1) {
            startObj = firstBracket;
            endObj = lastBracket;
        } else if (firstBrace != -1 && firstBracket != -1 && firstBracket < firstBrace) {
            startObj = firstBracket;
            endObj = lastBracket;
        }

        if (startObj == -1 || endObj == -1 || endObj < startObj) {
            System.err.println("CRITICAL: No valid JSON found in AI response: " + text);
            throw new RuntimeException("AI response does not contain valid JSON.");
        }

        return cleanedText.substring(startObj, endObj + 1);
    }
}
