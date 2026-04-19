package controller;

import dto.request.MetricsRequest;
import dto.response.MetricsResponse;
import entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import repository.UserRepository;
import service.MetricsService;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<MetricsResponse> saveMetrics(
            @Valid @RequestBody MetricsRequest request,
            Authentication authentication) {

        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        MetricsResponse response = metricsService.saveMetrics(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<MetricsResponse> getLatestMetrics(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found: " + username));

        MetricsResponse response = metricsService.getLatestMetrics(user);
        return ResponseEntity.ok(response);
    }
}
