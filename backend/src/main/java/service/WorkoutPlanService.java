package service;

import dto.response.AiWorkoutResponse;
import dto.response.WorkoutHistoryResponse;
import entity.User;
import entity.WorkoutPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.WorkoutPlanRepository;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class WorkoutPlanService {

    private final WorkoutPlanRepository workoutPlanRepository;

    @Transactional(readOnly = true)
    public List<WorkoutHistoryResponse> getWorkoutHistory(User user) {
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserOrderByCreatedAtDesc(user);
        return plans.stream()
                .map(plan -> new WorkoutHistoryResponse(
                        plan.getCreatedAt() != null ? plan.getCreatedAt().toString() : java.time.LocalDateTime.now().toString(),
                        plan.getGeneratedPlanJson()
                ))
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<AiWorkoutResponse> getAiWorkoutHistory(User user) {
        List<WorkoutPlan> plans = workoutPlanRepository.findByUserOrderByCreatedAtDesc(user);
        return plans.stream()
                .map(plan -> new AiWorkoutResponse(
                        plan.getId(),
                        plan.getGeneratedPlanJson(),
                        "Plan retrieved",
                        plan.getPlanName()
                ))
                .collect(Collectors.toList());
    }

    @Transactional
    public boolean deleteWorkout(Long id, User user) {
        Optional<WorkoutPlan> planOpt = workoutPlanRepository.findById(id);
        if (planOpt.isPresent()) {
            WorkoutPlan plan = planOpt.get();
            if (plan.getUser().getId().equals(user.getId())) {
                workoutPlanRepository.delete(plan);
                return true;
            }
        }
        return false;
    }
}
