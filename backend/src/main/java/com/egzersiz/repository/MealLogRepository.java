package com.egzersiz.repository;

import com.egzersiz.entity.MealLog;
import com.egzersiz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;

public interface MealLogRepository extends JpaRepository<MealLog, Long> {
    List<MealLog> findByUserOrderByCreatedAtDesc(User user);
    
    @Query("SELECT m FROM MealLog m WHERE m.user = :user AND m.createdAt >= :startOfDay AND m.createdAt <= :endOfDay ORDER BY m.createdAt DESC")
    List<MealLog> findByUserAndDateRange(
            @Param("user") User user, 
            @Param("startOfDay") LocalDateTime startOfDay, 
            @Param("endOfDay") LocalDateTime endOfDay);
}
