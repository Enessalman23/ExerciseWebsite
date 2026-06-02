package com.egzersiz.repository;

import com.egzersiz.entity.User;
import com.egzersiz.entity.UserMetrics;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserMetricsRepository extends JpaRepository<UserMetrics, Long> {
    Optional<UserMetrics> findFirstByUserOrderByRecordedAtDesc(User user);
    List<UserMetrics> findByUserOrderByRecordedAtAsc(User user);
}
