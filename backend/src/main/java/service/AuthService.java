package service;

import dto.request.LoginRequest;
import dto.request.RegisterRequest;
import dto.response.LoginResponse;
import entity.User;
import enums.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import repository.UserRepository;
import util.JwtUtil;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public String register (RegisterRequest request){
        if (userRepository.existsByUsername(request.getUsername())){
            throw new RuntimeException("Username already exists");
        } if (userRepository.existsByEmail(request.getEmail())){
            throw new RuntimeException("Email already exists");
        }
        User user = new User();
        user.setEmail(request.getEmail());
        user.setUsername(request.getUsername());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER);
        userRepository.save(user);

        return "User registered successfully";
    }

    public LoginResponse login(LoginRequest request){
        User user = userRepository.findFirstByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("Invalid username or password"));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())){
            throw  new RuntimeException("Invalid username or password");
        }
        String token = jwtUtil.generateToken(user.getUsername());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUsername());
        return new LoginResponse(token, refreshToken, user.getUsername(), user.getRole().name(), "Login Successful");
    }

    public LoginResponse refreshToken(dto.request.TokenRefreshRequest request) {
        String requestRefreshToken = request.getRefreshToken();
        
        String username;
        try {
            username = jwtUtil.extractUsername(requestRefreshToken);
        } catch (Exception e) {
            throw new RuntimeException("Invalid refresh token");
        }
        
        if (jwtUtil.validateToken(requestRefreshToken, username)) {
            User user = userRepository.findFirstByUsername(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            String token = jwtUtil.generateToken(username);
            String newRefreshToken = jwtUtil.generateRefreshToken(username);
            return new LoginResponse(token, newRefreshToken, username, user.getRole().name(), "Token refreshed successfully");
        }
        
        throw new RuntimeException("Refresh token is expired or invalid");
    }
}
