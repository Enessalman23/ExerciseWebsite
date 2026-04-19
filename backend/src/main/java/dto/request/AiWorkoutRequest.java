package dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Yapay Zeka Antrenman Üretim İsteği")
public class AiWorkoutRequest {
    @NotBlank(message = "Goal is required (e.g. Kilo vermek, Kas yapmak)")
    @Schema(description = "Kullanıcının ana hedefi", example = "Yağ yakmak ve sıkılaşmak")
    private String goal;
    
    @NotBlank(message = "Level is required (e.g. Başlangıç, Orta, İleri)")
    @Schema(description = "Kullanıcının fitness seviyesi", example = "Başlangıç")
    private String level;
    
    @Min(value = 1)
    @Max(value = 7)
    @Schema(description = "Haftalık antrenman gün sayısı", example = "3")
    private int daysPerWeek;
    
    @Schema(description = "Varsa ek sağlık problemleri veya notlar", example = "Boyun fıtığım var")
    private String extraInformation;

    @Schema(description = "Kullanıcının seçtiği odak kas grupları", example = "[\"chest\", \"biceps\"]")
    private java.util.List<String> focusMuscles;

    @Schema(description = "Kullanıcının ulaştığı veya tercih ettiği ekipmanlar", example = "[\"dumbbell\", \"barbell\", \"body weight\"]")
    private java.util.List<String> equipments;

    @Schema(description = "Kullanıcı cinsiyeti", example = "Erkek")
    private String gender;

    @Schema(description = "Program ismi", example = "Sahil Vücudu Programı")
    private String planName;
}
