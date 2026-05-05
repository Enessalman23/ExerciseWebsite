package entity;

import enums.ActivityLevel;
import enums.Gender;
import enums.Goal;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;


@Entity
@Table(name = "user_metrics", schema = "fitnessai")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMetrics {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private int age;

    @Column(nullable = false)
    private double weight;

    @Column(nullable = false)
    private double height;

    @Enumerated(EnumType.STRING)
    private Gender gender;

    @Enumerated(EnumType.STRING)
    private ActivityLevel activityLevel;

    @Enumerated(EnumType.STRING)
    private Goal goal;

    @Column(columnDefinition = "TEXT")
    private String dietaryRestrictions;

    @Column(columnDefinition = "TEXT")
    private String injuries;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime recordedAt;
}
