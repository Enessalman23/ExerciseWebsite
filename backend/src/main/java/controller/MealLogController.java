package controller;

import config.CurrentUser;
import entity.MealLog;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import repository.MealLogRepository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealLogController {

    private final MealLogRepository mealLogRepository;

    @GetMapping
    public ResponseEntity<List<MealLog>> getTodayMeals(@CurrentUser User user) {

        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        return ResponseEntity.ok(mealLogRepository.findByUserAndDateRange(user, startOfDay, endOfDay));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getMealHistory(@CurrentUser User user) {

        // Get exactly last 7 days (including today)
        LocalDate today = LocalDate.now();
        Map<LocalDate, Integer> dailyCalories = new java.util.TreeMap<>();
        
        // Initialize exactly last 7 days with 0 (from today-6 to today)
        for (int i = 0; i < 7; i++) {
            dailyCalories.put(today.minusDays(i), 0);
        }

        // Fetch meals from today-6 until now
        LocalDateTime startRange = LocalDateTime.of(today.minusDays(6), LocalTime.MIN);
        List<MealLog> allRecentMeals = mealLogRepository.findByUserAndDateRange(user, startRange, LocalDateTime.now());

        for (MealLog meal : allRecentMeals) {
            LocalDate date = meal.getCreatedAt().toLocalDate();
            if (dailyCalories.containsKey(date)) {
                dailyCalories.put(date, dailyCalories.get(date) + meal.getCalories());
            }
        }

        List<Map<String, Object>> result = new java.util.ArrayList<>();
        // TreeMap.keySet() is sorted, so we get ascending order
        for (LocalDate date : dailyCalories.keySet()) {
            Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("date", date.toString()); // YYYY-MM-DD
            entry.put("calories", dailyCalories.get(date));
            result.add(entry);
        }

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> addMeal(@RequestBody Map<String, Object> request, @CurrentUser User user) {

        try {
            String foodName = (String) request.get("foodName");
            if (foodName == null || foodName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body("Yemek adı boş olamaz");
            }

            Integer cals = parseNutrient(request.get("calories"));
            Integer protein = parseNutrient(request.get("protein"));
            Integer carbs = parseNutrient(request.get("carbs"));
            Integer fats = parseNutrient(request.get("fats"));

            MealLog meal = MealLog.builder()
                    .user(user)
                    .foodName(foodName)
                    .calories(cals)
                    .protein(protein)
                    .carbs(carbs)
                    .fats(fats)
                    .build();

            return ResponseEntity.ok(mealLogRepository.save(meal));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hatalı veri girişi: " + e.getMessage());
        }
    }

    private Integer parseNutrient(Object value) {
        if (value == null || value.toString().trim().isEmpty()) return 0;
        try {
            return (int) Math.round(Double.parseDouble(value.toString()));
        } catch (NumberFormatException e) {
            return 0;
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeal(@PathVariable Long id, @CurrentUser User user) {
        return mealLogRepository.findById(id)
                .map(meal -> {
                    if (!meal.getUser().getId().equals(user.getId())) {
                        return ResponseEntity.status(403).body("Unauthorized");
                    }
                    mealLogRepository.delete(meal);
                    return ResponseEntity.ok("Deleted");
                })
                .orElse(ResponseEntity.status(404).body("Meal not found"));
    }
}
