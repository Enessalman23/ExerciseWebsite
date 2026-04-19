package dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import enums.ActivityLevel;
import enums.Gender;
import enums.Goal;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
@Schema(description = "Kullanıcı Metrikleri Yanıtı")
public class MetricsResponse {
    @Schema(description = "Kayıt numarası", example = "1")
    private Long id;
    
    @Schema(description = "Yaş", example = "25")
    private int age;
    
    @Schema(description = "Kilo", example = "75.5")
    private double weight;
    
    @Schema(description = "Boy", example = "180")
    private double height;
    
    @Schema(description = "Cinsiyet", example = "MALE")
    private Gender gender;
    
    @Schema(description = "Hareket seviyesi", example = "MODERATELY_ACTIVE")
    private ActivityLevel activityLevel;
    
    @Schema(description = "Hedef", example = "HYPERTROPHY")
    private Goal goal;
    
    @Schema(description = "Diyet kısıtlamaları", example = "Vegan")
    private String dietaryRestrictions;
    
    @Schema(description = "Sakatlıklar", example = "Sağ omuzda yırtık var")
    private String injuries;
    
    @Schema(description = "Kayıt tarihi", example = "2026-04-12T15:30:00")
    private LocalDateTime recordedAt;
}
