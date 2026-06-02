package controller;

import config.CurrentUser;
import entity.MealLog;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.MealLogService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/meals")
@RequiredArgsConstructor
public class MealLogController {

    private final MealLogService mealLogService;

    @GetMapping
    public ResponseEntity<List<MealLog>> getTodayMeals(@CurrentUser User user) {
        return ResponseEntity.ok(mealLogService.getTodayMeals(user));
    }

    @GetMapping("/history")
    public ResponseEntity<List<Map<String, Object>>> getMealHistory(@CurrentUser User user) {
        return ResponseEntity.ok(mealLogService.getMealHistory(user));
    }

    @PostMapping
    public ResponseEntity<?> addMeal(@RequestBody Map<String, Object> request, @CurrentUser User user) {
        try {
            return ResponseEntity.ok(mealLogService.addMeal(request, user));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Hatalı veri girişi: " + e.getMessage());
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMeal(@PathVariable Long id, @CurrentUser User user) {
        boolean deleted = mealLogService.deleteMeal(id, user);
        if (deleted) {
            return ResponseEntity.ok("Deleted");
        } else {
            return ResponseEntity.status(404).body("Meal not found or unauthorized");
        }
    }
}
