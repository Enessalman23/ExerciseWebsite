package com.egzersiz.controller;

import com.egzersiz.dto.request.TokenRefreshRequest;
import com.egzersiz.dto.request.LoginRequest;
import com.egzersiz.dto.request.RegisterRequest;
import com.egzersiz.dto.response.LoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.egzersiz.service.AuthService;

@RestController
@RequestMapping(path = "/api/auth")
@RequiredArgsConstructor
public class AuthController {
    private final AuthService authService;

    @PostMapping(path = "/register")
    public ResponseEntity<String> register(@Valid @RequestBody RegisterRequest request){
        String response = authService.register(request);
        return ResponseEntity.ok(response);
    }
    
    @PostMapping(path = "/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request){
         LoginResponse response = authService.login(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping(path = "/refresh")
    public ResponseEntity<LoginResponse> refresh(@Valid @RequestBody TokenRefreshRequest request){
        LoginResponse response = authService.refreshToken(request);
        return ResponseEntity.ok(response);
    }
}
