package service;

import dto.response.LeaderboardDto;
import entity.Badge;
import entity.User;
import entity.UserBadge;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import repository.BadgeRepository;
import repository.UserBadgeRepository;
import repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class GamificationService {

    private final UserRepository userRepository;
    private final BadgeRepository badgeRepository;
    private final UserBadgeRepository userBadgeRepository;

    @Transactional
    public void addPoints(User user, int points) {
        user.setTotalPoints(user.getTotalPoints() + points);
        userRepository.save(user);
        checkBadges(user);
    }

    private void checkBadges(User user) {
        // Örnek Badge Kontrolleri
        if (user.getTotalPoints() >= 100) {
            awardBadge(user, "Yüzler Kulübü");
        }
        if (user.getTotalPoints() >= 1000) {
            awardBadge(user, "Binlik Savaşçı");
        }
        if (user.getTotalPoints() >= 5000) {
            awardBadge(user, "Efsanevi Atlet");
        }
    }

    public void awardBadge(User user, String badgeName) {
        if (!userBadgeRepository.existsByUserAndBadge_Name(user, badgeName)) {
            Badge badge = badgeRepository.findByName(badgeName).orElse(null);
            if (badge != null) {
                UserBadge userBadge = UserBadge.builder()
                        .user(user)
                        .badge(badge)
                        .build();
                userBadgeRepository.save(userBadge);
            }
        }
    }

    public List<LeaderboardDto> getLeaderboard() {
        return userRepository.findTop10ByOrderByTotalPointsDesc().stream()
                .map(user -> new LeaderboardDto(user.getUsername(), user.getTotalPoints()))
                .collect(Collectors.toList());
    }

    public List<Badge> getMyBadges(User user) {
        return userBadgeRepository.findByUser(user).stream()
                .map(UserBadge::getBadge)
                .collect(Collectors.toList());
    }
}
