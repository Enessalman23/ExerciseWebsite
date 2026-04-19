package entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "workout_plans", schema = "fitnessai")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // Yapay zekadan dönen karmaşık JSON çıktısını saklayacağımız alan
    @Column(columnDefinition = "TEXT", nullable = false)
    private String generatedPlanJson;

    @Column(nullable = true)
    private String planName;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private boolean isActive;
}
