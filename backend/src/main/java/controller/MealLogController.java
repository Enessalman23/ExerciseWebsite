package controller;

import entity.MealLog;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import repository.MealLogRepository;
import repository.UserRepository;

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
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<MealLog>> getTodayMeals(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime startOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MIN);
        LocalDateTime endOfDay = LocalDateTime.of(LocalDate.now(), LocalTime.MAX);

        return ResponseEntity.ok(mealLogRepository.findByUserAndDateRange(user, startOfDay, endOfDay));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getMealHistory(Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        LocalDateTime sevenDaysAgo = LocalDateTime.of(LocalDate.now().minusDays(7), LocalTime.MIN);
        List<MealLog> allRecentMeals = mealLogRepository.findByUserAndDateRange(user, sevenDaysAgo, LocalDateTime.now());

        // Group by date
        Map<LocalDate, Integer> dailyCalories = new java.util.TreeMap<>();
        // Initialize last 7 days with 0
        for (int i = 0; i <= 7; i++) {
            dailyCalories.put(LocalDate.now().minusDays(i), 0);
        }

        for (MealLog meal : allRecentMeals) {
            LocalDate date = meal.getCreatedAt().toLocalDate();
            dailyCalories.put(date, dailyCalories.getOrDefault(date, 0) + meal.getCalories());
        }

        List<Map<String, Object>> result = new java.util.ArrayList<>();
        dailyCalories.forEach((date, calories) -> {
            Map<String, Object> entry = new java.util.HashMap<>();
            entry.put("date", date.toString());
            entry.put("calories", calories);
            result.add(entry);
        });

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> addMeal(@RequestBody Map<String, Object> request, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

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
    public ResponseEntity<?> deleteMeal(@PathVariable Long id, Authentication authentication) {
        String username = authentication.getName();
        User user = userRepository.findFirstByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));

        MealLog meal = mealLogRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Meal not found"));

        if (!meal.getUser().getId().equals(user.getId())) {
            return ResponseEntity.status(403).body("Unauthorized");
        }

        mealLogRepository.delete(meal);
        return ResponseEntity.ok("Deleted");
    }
}
