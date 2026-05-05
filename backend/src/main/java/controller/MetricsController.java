package controller;

import config.CurrentUser;
import dto.request.MetricsRequest;
import dto.response.MetricsResponse;
import entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.MetricsService;

@RestController
@RequestMapping("/api/metrics")
@RequiredArgsConstructor
public class MetricsController {

    private final MetricsService metricsService;

    @PostMapping
    public ResponseEntity<MetricsResponse> saveMetrics(
            @Valid @RequestBody MetricsRequest request,
            @CurrentUser User user) {

        MetricsResponse response = metricsService.saveMetrics(request, user);
        return ResponseEntity.ok(response);
    }

    @GetMapping
    public ResponseEntity<MetricsResponse> getLatestMetrics(@CurrentUser User user) {

        MetricsResponse response = metricsService.getLatestMetrics(user);
        return ResponseEntity.ok(response);
    }
}
