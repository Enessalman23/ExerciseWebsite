package controller;

import dto.request.TokenRefreshRequest;
import dto.request.LoginRequest;
import dto.request.RegisterRequest;
import dto.response.LoginResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import service.AuthService;

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
