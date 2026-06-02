package com.egzersiz.service;

import com.egzersiz.dto.request.MetricsRequest;
import com.egzersiz.dto.response.MetricsResponse;
import com.egzersiz.entity.User;
import com.egzersiz.entity.UserMetrics;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import com.egzersiz.repository.UserMetricsRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class MetricsService {

    private final UserMetricsRepository metricsRepository;

    public MetricsResponse saveMetrics(MetricsRequest request, User user) {
        UserMetrics metrics = UserMetrics.builder()
                .user(user)
                .age(request.getAge())
                .weight(request.getWeight())
                .height(request.getHeight())
                .gender(request.getGender())
                .activityLevel(request.getActivityLevel())
                .goal(request.getGoal())
                .dietaryRestrictions(request.getDietaryRestrictions())
                .injuries(request.getInjuries())
                .build();

        UserMetrics saved = metricsRepository.save(metrics);
        return mapToResponse(saved);
    }

    public MetricsResponse getLatestMetrics(User user) {
        return metricsRepository.findFirstByUserOrderByRecordedAtDesc(user)
                .map(this::mapToResponse)
                .orElse(null);
    }

    public List<MetricsResponse> getMetricsHistory(User user) {
        return metricsRepository.findByUserOrderByRecordedAtAsc(user).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    private MetricsResponse mapToResponse(UserMetrics metrics) {
        return MetricsResponse.builder()
                .id(metrics.getId())
                .age(metrics.getAge())
                .weight(metrics.getWeight())
                .height(metrics.getHeight())
                .gender(metrics.getGender())
                .activityLevel(metrics.getActivityLevel())
                .goal(metrics.getGoal())
                .dietaryRestrictions(metrics.getDietaryRestrictions())
                .injuries(metrics.getInjuries())
                .recordedAt(metrics.getRecordedAt())
                .build();
    }
}
