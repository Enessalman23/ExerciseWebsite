package com.egzersiz.controller;

import com.egzersiz.config.CurrentUser;
import com.egzersiz.entity.User;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/user")
public class UserController {

    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@CurrentUser User user) {
        return ResponseEntity.ok(Map.of(
                "id", user.getId(),
                "username", user.getUsername(),
                "email", user.getEmail(),
                "role", user.getRole().name()
        ));
    }

    // Sadece 'USER' (veya 'ADMIN') rolüne sahip olanlar erişebilir
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/profile")
    public ResponseEntity<String> getUserProfile(@CurrentUser User user) {
        return ResponseEntity.ok("Merhaba, " + user.getUsername());
    }

    // Sadece 'ADMIN' rolüne sahip olanlar erişebilir
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin-panel")
    public ResponseEntity<String> getAdminDashboard(@CurrentUser User user) {
        return ResponseEntity.ok("Hoş geldin Admin " + user.getUsername());
    }
}
