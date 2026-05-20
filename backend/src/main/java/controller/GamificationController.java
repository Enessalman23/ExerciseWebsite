package controller;

import config.CurrentUser;
import dto.response.LeaderboardDto;
import entity.Badge;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import service.GamificationService;

import java.util.List;

@RestController
@RequestMapping("/api/gamification")
@RequiredArgsConstructor
public class GamificationController {

    private final GamificationService gamificationService;

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardDto>> getLeaderboard() {
        return ResponseEntity.ok(gamificationService.getLeaderboard());
    }

    @GetMapping("/badges")
    public ResponseEntity<List<Badge>> getMyBadges(@CurrentUser User user) {
        return ResponseEntity.ok(gamificationService.getMyBadges(user));
    }

    @PostMapping("/award-badge")
    public ResponseEntity<Void> awardBadge(@CurrentUser User user, @RequestBody String badgeName) {
        // Remove quotes if present from JSON body
        String cleanedName = badgeName.replace("\"", "");
        gamificationService.awardBadge(user, cleanedName);
        return ResponseEntity.ok().build();
    }
}
