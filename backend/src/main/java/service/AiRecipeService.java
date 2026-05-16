package service;

import entity.User;
import entity.UserMetrics;
import lombok.RequiredArgsConstructor;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;
import repository.UserMetricsRepository;

@Service
@RequiredArgsConstructor
public class AiRecipeService {

    private final GeminiClientService geminiClientService;
    private final UserMetricsRepository userMetricsRepository;

    @Cacheable(value = "ai_responses", key = "'recipe-' + #user.id + '-' + #ingredients.hashCode()")
    public String generateRecipe(String ingredients, User user) {
        UserMetrics metrics = userMetricsRepository.findFirstByUserOrderByRecordedAtDesc(user).orElse(null);

        String systemPrompt = "Sen profesyonel bir sporcu aşçısı ve diyetisyensin. " +
                "Kullanıcının elindeki malzemelere ve hedefine uygun, makro değerleri (Protein, Karbonhidrat, Yağ) yaklaşık olarak belirtilmiş SAĞLIKLI BİR TARİF oluştur.\n" +
                "Kullanıcının diyet kısıtlamalarını dikkate al.\n" +
                "Kullanıcı Profili:\n" +
                (metrics != null ?
                        "- Hedef: " + metrics.getGoal() + "\n" +
                        "- Kısıtlamalar: " + (metrics.getDietaryRestrictions() != null ? metrics.getDietaryRestrictions() : "Yok") + "\n"
                        : "Veri yok.\n");

        String fullPrompt = systemPrompt + "\nKullanıcının Malzemeleri veya İsteği: " + ingredients + "\nLütfen sadece tarifi, hazırlanışını ve makroları ver. Gereksiz sohbet etme.";

        try {
            return geminiClientService.generateContent(fullPrompt, 2, false);
        } catch (Exception e) {
            System.err.println("AI Recipe Generation Failed: " + e.getMessage());
            return "Üzgünüm, şu an tarif oluşturamıyorum. Lütfen daha sonra tekrar dene.";
        }
    }
}
