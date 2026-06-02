package com.egzersiz.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import com.egzersiz.enums.ActivityLevel;
import com.egzersiz.enums.Gender;
import com.egzersiz.enums.Goal;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
@Schema(description = "Kullanıcı Metrikleri Oluşturma/Güncelleme İsteği")
public class MetricsRequest {

    @Min(value = 10, message = "Age must be at least 10")
    @Schema(description = "Kullanıcının yaşı", example = "25")
    private int age;

    @Min(value = 30, message = "Weight must be valid")
    @Schema(description = "Kullanıcının kilosu (kg)", example = "75.5")
    private double weight;

    @Min(value = 100, message = "Height must be valid")
    @Schema(description = "Kullanıcının boyu (cm)", example = "180.0")
    private double height;

    @NotNull(message = "Gender is required")
    @Schema(description = "Cinsiyet", example = "MALE")
    private Gender gender;

    @NotNull(message = "Activity level is required")
    @Schema(description = "Günlük hareket seviyesi", example = "MODERATELY_ACTIVE")
    private ActivityLevel activityLevel;

    @NotNull(message = "Goal is required")
    @Schema(description = "Ana hedef", example = "HYPERTROPHY")
    private Goal goal;

    @Schema(description = "Diyet kısıtlamaları", example = "Vegan")
    private String dietaryRestrictions;
    
    @Schema(description = "Geçmiş veya mevcut sakatlıklar", example = "Sağ omuzda yırtık")
    private String injuries;
}
