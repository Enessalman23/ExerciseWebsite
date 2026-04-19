package controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/user")
public class UserController {

    // Sadece 'USER' (veya 'ADMIN') rolüne sahip olanlar erişebilir
    @PreAuthorize("hasAnyRole('USER', 'ADMIN')")
    @GetMapping("/profile")
    public ResponseEntity<String> getUserProfile(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok("Merhaba, " + username);
    }

    // Sadece 'ADMIN' rolüne sahip olanlar erişebilir
    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping("/admin-panel")
    public ResponseEntity<String> getAdminDashboard(Authentication authentication) {
        String username = authentication.getName();
        return ResponseEntity.ok("Hoş geldin Admin " + username);
    }
}
