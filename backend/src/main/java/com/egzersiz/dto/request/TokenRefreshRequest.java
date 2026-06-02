package com.egzersiz.dto.request;

import io.swagger.v3.oas.annotations.media.Schema;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
@Schema(description = "Refresh Token İsteği")
public class TokenRefreshRequest {
    @NotBlank
    @Schema(description = "Süresi dolmayan geçerli refresh token", example = "eyJhbGciOiJIUzI1NiJ9...")
    private String refreshToken;
}
