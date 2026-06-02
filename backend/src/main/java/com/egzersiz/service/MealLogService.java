package com.egzersiz.service;

import com.egzersiz.entity.MealLog;
import com.egzersiz.entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.egzersiz.repository.MealLogRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class MealLogService {

    private final MealLogRepository mealLogRepository;

    @Transactional(readOnly = true)
    public List<MealLog> getTodayMeals(User user) {
        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);
        return mealLogRepository.findByUserAndDateRange(user, startOfDay, endOfDay);
    }

    @Transactional(readOnly = true)
    public List<Map<String, Object>> getMealHistory(User user) {
        LocalDate today = LocalDate.now();
        Map<LocalDate, Integer> dailyCalories = new TreeMap<>();
        
        for (int i = 0; i < 7; i++) {
            dailyCalories.put(today.minusDays(i), 0);
        }

        LocalDateTime startRange = LocalDateTime.of(today.minusDays(6), LocalTime.MIN);
        List<MealLog> allRecentMeals = mealLogRepository.findByUserAndDateRange(user, startRange, LocalDateTime.now());

        for (MealLog meal : allRecentMeals) {
            LocalDate date = meal.getCreatedAt().toLocalDate();
            if (dailyCalories.containsKey(date)) {
                dailyCalories.put(date, dailyCalories.get(date) + meal.getCalories());
            }
        }

        List<Map<String, Object>> result = new ArrayList<>();
        for (LocalDate date : dailyCalories.keySet()) {
            Map<String, Object> entry = new HashMap<>();
            entry.put("date", date.toString());
            entry.put("calories", dailyCalories.get(date));
            result.add(entry);
        }

        return result;
    }

    @Transactional
    public MealLog addMeal(Map<String, Object> request, User user) {
        String foodName = (String) request.get("foodName");
        if (foodName == null || foodName.trim().isEmpty()) {
            throw new IllegalArgumentException("Yemek adı boş olamaz");
        }

        Integer cals = parseNutrient(request.get("calories"));
        Integer protein = parseNutrient(request.get("protein"));
        Integer carbs = parseNutrient(request.get("carbs"));
        Integer fats = parseNutrient(request.get("fats"));
        Integer sodium = parseNutrient(request.get("sodium"));
        Integer potassium = parseNutrient(request.get("potassium"));
        Integer calcium = parseNutrient(request.get("calcium"));
        Integer caffeine = parseNutrient(request.get("caffeine"));
        Integer vitaminC = parseNutrient(request.get("vitaminC"));
        Integer iron = parseNutrient(request.get("iron"));

        MealLog meal = MealLog.builder()
                .user(user)
                .foodName(foodName)
                .calories(cals)
                .protein(protein)
                .carbs(carbs)
                .fats(fats)
                .sodium(sodium)
                .potassium(potassium)
                .calcium(calcium)
                .caffeine(caffeine)
                .vitaminC(vitaminC)
                .iron(iron)
                .build();

        return mealLogRepository.save(meal);
    }

    @Transactional
    public boolean deleteMeal(Long id, User user) {
        Optional<MealLog> mealOpt = mealLogRepository.findById(id);
        if (mealOpt.isPresent()) {
            MealLog meal = mealOpt.get();
            if (meal.getUser().getId().equals(user.getId())) {
                mealLogRepository.delete(meal);
                return true;
            }
        }
        return false;
    }

    private Integer parseNutrient(Object value) {
        if (value == null || value.toString().trim().isEmpty()) return 0;
        try {
            return (int) Math.round(Double.parseDouble(value.toString()));
        } catch (NumberFormatException e) {
            return 0;
        }
    }
}
