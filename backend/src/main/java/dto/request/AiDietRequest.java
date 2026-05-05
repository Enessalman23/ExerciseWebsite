package dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
@Schema(description = "Yapay Zeka Beslenme Planı İsteği")
public class AiDietRequest {

    @Min(value = 1)
    @Max(value = 6)
    @Schema(description = "Günlük tercih edilen öğün sayısı", example = "3")
    private int mealsPerDay;

    @Schema(description = "Alerjiler veya tercih edilmeyen gıdalar", example = "Fıstık alerjim var, mantar sevmem")
    private String allergies;

    @Schema(description = "Planın ismi", example = "Yazlık Diyet")
    private String planName;

    @Schema(description = "Diyet hedefi", example = "FAT_LOSS")
    private String goal;
}
