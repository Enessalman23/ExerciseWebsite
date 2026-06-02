package com.egzersiz.controller;

import com.egzersiz.config.CurrentUser;
import com.egzersiz.dto.request.MetricsRequest;
import com.egzersiz.dto.response.MetricsResponse;
import com.egzersiz.entity.User;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.egzersiz.service.MetricsService;

import java.util.List;

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

    @GetMapping("/history")
    public ResponseEntity<List<MetricsResponse>> getMetricsHistory(@CurrentUser User user) {
        List<MetricsResponse> response = metricsService.getMetricsHistory(user);
        return ResponseEntity.ok(response);
    }
}
