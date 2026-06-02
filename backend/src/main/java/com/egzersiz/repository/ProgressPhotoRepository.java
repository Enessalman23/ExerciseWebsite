package com.egzersiz.repository;

import com.egzersiz.entity.ProgressPhoto;
import com.egzersiz.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProgressPhotoRepository extends JpaRepository<ProgressPhoto, Long> {
    List<ProgressPhoto> findByUserOrderByIdDesc(User user);
}
