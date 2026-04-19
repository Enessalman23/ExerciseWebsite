package service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import entity.User;
import entity.UserMetrics;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import repository.UserMetricsRepository;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AiCoachService {

    @Value("${gemini.api.key}")
    private String geminiApiKey;

    private final UserMetricsRepository userMetricsRepository;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public String getCoachResponse(String userMessage, User user) {
        UserMetrics metrics = userMetricsRepository.findFirstByUserOrderByRecordedAtDesc(user).orElse(null);
        
        String systemPrompt = "Sen 'Antigravity' isimli, profesyonel bir yapay zeka fitness ve beslenme koçusun. " +
                "Kullanıcıya yardımcı, motive edici ve bilimsel verilere dayanan kısa, öz tavsiyeler ver. " +
                "Kullanıcı bilgileri: \n" +
                (metrics != null ? 
                  "- Boy: " + metrics.getHeight() + " cm\n" +
                  "- Kilo: " + metrics.getWeight() + " kg\n" +
                  "- Hedef: " + metrics.getGoal() + "\n" +
                  "- Aktivite Seviyesi: " + metrics.getActivityLevel() + "\n"
                  : "Henüz profil verileri girilmemiş.");

        String geminiEndpoint = "https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent?key=" + geminiApiKey;
        RestTemplate restTemplate = new RestTemplate();

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        Map<String, Object> body = Map.of(
            "contents", List.of(
                Map.of("role", "user", "parts", List.of(Map.of("text", systemPrompt + "\n\nKullanıcı Sorusuna Cevap Ver: " + userMessage)))
            )
        );

        try {
            HttpEntity<Map<String, Object>> httpEntity = new HttpEntity<>(body, headers);
            String responseStr = restTemplate.postForObject(geminiEndpoint, httpEntity, String.class);
            if (responseStr == null) return "AI servisi boş yanıt döndürdü.";
            
            JsonNode root = objectMapper.readTree(responseStr);
            JsonNode candidate = root.path("candidates").get(0);
            if (candidate.isMissingNode()) {
                System.err.println("Gemini API Error: " + responseStr);
                return "Şu an cevap veremiyorum, lütfen biraz sonra tekrar dene.";
            }
            
            return candidate.path("content").path("parts").get(0).path("text").asText();
        } catch (Exception e) {
            System.err.println("AI Coach Service Failed: " + e.getMessage());
            return "Üzgünüm, şu an bağlantı kuramıyorum. Lütfen daha sonra tekrar dene.";
        }
    }
}
