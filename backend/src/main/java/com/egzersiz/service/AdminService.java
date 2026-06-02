package com.egzersiz.service;

import com.egzersiz.entity.User;
import com.egzersiz.enums.Role;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.egzersiz.repository.DietPlanRepository;
import com.egzersiz.repository.MealLogRepository;
import com.egzersiz.repository.UserRepository;
import com.egzersiz.repository.WorkoutPlanRepository;

import java.util.*;

@Service
@RequiredArgsConstructor
@Slf4j
public class AdminService {

    private final UserRepository userRepository;
    private final WorkoutPlanRepository workoutPlanRepository;
    private final DietPlanRepository dietPlanRepository;
    private final MealLogRepository mealLogRepository;

    @Transactional(readOnly = true)
    public Map<String, Object> getSystemStats() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalUsers", userRepository.count());
        stats.put("totalWorkouts", workoutPlanRepository.count());
        stats.put("totalDiets", dietPlanRepository.count());
        stats.put("totalMeals", mealLogRepository.count());
        return stats;
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getAllUsersDetailed() {
        List<User> users = userRepository.findAll();
        List<Map<String, Object>> userDetails = new ArrayList<>();
        for (User user : users) {
            Map<String, Object> detail = new HashMap<>();
            detail.put("id", user.getId());
            detail.put("username", user.getUsername());
            detail.put("email", user.getEmail());
            detail.put("role", user.getRole().name());
            userDetails.add(detail);
        }
        return userDetails;
    }

    @Transactional
    public boolean updateUserRole(Long id, String roleStr) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            try {
                User user = userOpt.get();
                Role role = Role.valueOf(roleStr.toUpperCase());
                user.setRole(role);
                userRepository.save(user);
                return true;
            } catch (IllegalArgumentException e) {
                log.error("Geçersiz rol tipi: {}", roleStr);
            }
        }
        return false;
    }

    @Transactional
    public boolean deleteUser(Long id) {
        Optional<User> userOpt = userRepository.findById(id);
        if (userOpt.isPresent()) {
            userRepository.delete(userOpt.get());
            return true;
        }
        return false;
    }
}
