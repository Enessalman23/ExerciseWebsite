package com.egzersiz.service;

import com.egzersiz.dto.response.AiDietResponse;
import com.egzersiz.entity.DietPlan;
import com.egzersiz.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.egzersiz.repository.DietPlanRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class DietPlanService {

    private final DietPlanRepository dietPlanRepository;

    @Transactional(readOnly = true)
    public List<AiDietResponse> getDietHistory(User user) {
        List<DietPlan> plans = dietPlanRepository.findByUserOrderByCreatedAtDesc(user);
        return plans.stream()
                .map(plan -> AiDietResponse.builder()
                        .dietPlanId(plan.getId())
                        .planName(plan.getPlanName() != null ? plan.getPlanName() : "Diyet Planı")
                        .generatedPlanJson(plan.getGeneratedPlanJson())
                        .targetDailyCalories(plan.getTargetDailyCalories())
                        .targetProtein(plan.getTargetProtein())
                        .targetCarbs(plan.getTargetCarbs())
                        .targetFats(plan.getTargetFats())
                        .createdAt(plan.getCreatedAt())
                        .message("Diet plan retrieved successfully!")
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean deleteDietPlan(Long id, User user) {
        Optional<DietPlan> planOpt = dietPlanRepository.findById(id);
        if (planOpt.isPresent()) {
            DietPlan plan = planOpt.get();
            if (plan.getUser().getId().equals(user.getId())) {
                dietPlanRepository.delete(plan);
                return true;
            }
        }
        return false;
    }
}
