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
                "--- KATI KURALLAR ---\n" +
                "1. MALZEME SADAKATİ: Tarifin ANA malzemeleri sadece ve sadece kullanıcının yazdığı malzemeler olmalıdır. Kullanıcının belirtmediği hiçbir malzemeyi ana tarifin malzemeler listesine ekleme veya tarifin yapılışında zorunlu kılma.\n" +
                "2. İSTEĞE BAĞLI EKLEMELER: Eğer kullanıcının malzemeleri hedefine (örneğin protein ihtiyacına) tam yetmiyorsa, tarifi yine de sadece onun malzemeleriyle oluştur. Gerekirse tarifin en altına 'Koçun Tavsiyesi (Opsiyonel/İsteğe Bağlı):' başlığı altında eklenebilecek malzemeleri (protein tozu, fıstık ezmesi vb.) tavsiye olarak yaz ama asla ana tarife dahil etme.\n" +
                "3. DİYET KISITLAMALARI: Kullanıcının diyet kısıtlamalarını kesinlikle dikkate al.\n" +
                "4. DOĞAL BAŞLIK VE SUNUM: Tarif başlıklarında veya açıklamalarında 'Hipertrofi Odaklı', 'Yağ Yakımı Uyumlu', 'Kas Geliştirme Kasesi' gibi yapay ve zorlama spor/fitness terimleri kullanma. Başlıklar son derece sade, iştah açıcı, doğal ve lezzetli yemek isimleri olmalıdır (Örn: 'Ballı Mısır Gevreği Kasesi'). Makro dengesini kullanıcının hedefine göre ayarla ama bunu başlığa taşıma.\n" +
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
