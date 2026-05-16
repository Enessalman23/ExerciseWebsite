package entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "progress_photos", schema = "fitnessai")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ProgressPhoto {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false)
    private String photoUrl; // S3 linki, veya sunucu içi base64 / dosya yolu

    private double weightAtTime;

    private String note;
    
    private LocalDate photoDate;

    @CreationTimestamp
    @Column(updatable = false)
    private LocalDateTime createdAt;
}
