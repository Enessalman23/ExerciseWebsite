package controller;

import config.CurrentUser;
import dto.response.LeaderboardDto;
import entity.Badge;
import entity.User;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
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
}
