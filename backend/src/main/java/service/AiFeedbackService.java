package service;

import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AiFeedbackService {

    private final GeminiClientService geminiClientService;

    public String generateWorkoutFeedback(int rpe, String dayName, User user) {
        String intensityDescription = getIntensityDescription(rpe);
        
        String systemPrompt = "Sen 'Demir Yumruk Koç'sun. Kullanıcı az önce '" + dayName + "' antrenmanını bitirdi.\n" +
                "Kullanıcının algıladığı zorluk seviyesi (RPE) 10 üzerinden " + rpe + " (" + intensityDescription + ").\n" +
                "Kullanıcıya bu zorluk seviyesine uygun, motive edici, esneme ve beslenme tavsiyesi içeren kısa ve öz bir antrenman sonu geri bildirimi ver.\n" +
                "Mesajın çok uzun olmasın, coşkulu ve destekleyici olsun.";

        try {
            return geminiClientService.generateContent(systemPrompt, 2, false);
        } catch (Exception e) {
            System.err.println("AI Feedback Generation Failed: " + e.getMessage());
            return "Harika bir antrenmandı! Bol su içmeyi ve protein almayı unutma. Aynen devam!";
        }
    }

    private String getIntensityDescription(int rpe) {
        if (rpe <= 3) return "Çok kolay";
        if (rpe <= 5) return "Kolay";
        if (rpe <= 7) return "Orta / Zorlayıcı";
        if (rpe <= 9) return "Çok zor";
        return "Maksimum efor / Tüketici";
    }
}
