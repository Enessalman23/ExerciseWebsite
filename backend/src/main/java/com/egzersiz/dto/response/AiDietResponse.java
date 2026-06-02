package com.egzersiz.dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Yapay Zeka Beslenme Planı Yanıtı")
public class AiDietResponse {
    
    @Schema(description = "Oluşturulan veya getirilen planın veritabanı ID'si", example = "1")
    private Long dietPlanId;

    @Schema(description = "Planın ismi", example = "Yazlık Diyet")
    private String planName;
    
    @Schema(description = "Gemini AI tarafından üretilen beslenme JSON'ı", example = "{\"dailyCalories\":2000, \"meals\":[...]}")
    private String generatedPlanJson;
    
    @Schema(description = "Hedef Kalori", example = "2500")
    private Integer targetDailyCalories;
    
    @Schema(description = "Hedef Protein (g)", example = "150")
    private Integer targetProtein;
    
    @Schema(description = "Hedef Karbonhidrat (g)", example = "250")
    private Integer targetCarbs;
    
    @Schema(description = "Hedef Yağ (g)", example = "80")
    private Integer targetFats;
    
    @Schema(description = "Oluşturulma tarihi", example = "2026-04-12T15:30:00")
    private LocalDateTime createdAt;
    
    @Schema(description = "Durum mesajı", example = "Diet plan generated successfully!")
    private String message;
}
