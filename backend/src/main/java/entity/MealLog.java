package entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "meal_logs", schema = "fitnessai")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealLog {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String foodName;

    private Integer calories;
    private Integer protein;
    private Integer carbs;
    private Integer fats;

    private Integer sodium;
    private Integer potassium;
    private Integer calcium;
    private Integer caffeine;
    private Integer vitaminC;
    private Integer iron;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
