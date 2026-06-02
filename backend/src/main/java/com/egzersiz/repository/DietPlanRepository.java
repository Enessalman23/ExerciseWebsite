package com.egzersiz.repository;

import com.egzersiz.entity.DietPlan;
import com.egzersiz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface DietPlanRepository extends JpaRepository<DietPlan, Long> {
    List<DietPlan> findByUserOrderByCreatedAtDesc(User user);
}
