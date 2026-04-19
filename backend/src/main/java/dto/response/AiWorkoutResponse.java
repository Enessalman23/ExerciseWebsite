package dto.response;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Schema(description = "Yapay Zeka Antrenman Yanıtı")
public class AiWorkoutResponse {
    @Schema(description = "Oluşturulan veya getirilen planın veritabanı ID'si", example = "1")
    private Long workoutPlanId;
    
    @Schema(description = "Gemini AI tarafından üretilen ve lokal verilerle zenginleştirilen JSON", example = "{\"days\":[...]}")
    private String workoutPlanJson;
    
    @Schema(description = "İşlem sonucu mesajı", example = "Workout created successfully!")
    private String message;

    @Schema(description = "Program ismi", example = "Kış Hazırlık")
    private String planName;
}
