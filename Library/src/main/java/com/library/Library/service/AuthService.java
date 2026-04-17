package com.library.Library.service;

import com.library.Library.dao.UserRepository;
import com.library.Library.entity.User;
import com.library.Library.requestmodels.LoginRequest;
import com.library.Library.requestmodels.RegisterRequest;
import com.library.Library.security.JwtService;
import com.library.Library.security.Role;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.validation.annotation.Validated;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.Validator;

import java.util.HashMap;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Validated
public class AuthService {
    
    private final UserRepository userRepository;
    private final JwtService jwtService;
    private final PasswordEncoder passwordEncoder;
    private final Validator validator;
    
    public Map<String, Object> login(LoginRequest request) {

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    return new RuntimeException("User not found");
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        String accessToken = jwtService.generateToken(user.getEmail(), user.getRole().name());
        String refreshToken = jwtService.generateRefreshToken(user.getEmail());
        
        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("tokenType", "Bearer");
        response.put("role", user.getRole().name());
        
        return response;
    }
    
    public Map<String, Object> refreshToken(String refreshToken) {
        try {
            String username = jwtService.extractUsername(refreshToken);
            
            User user = userRepository.findByEmail(username)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            String newAccessToken = jwtService.generateToken(user.getEmail(), user.getRole().name());
            
            Map<String, Object> response = new HashMap<>();
            response.put("accessToken", newAccessToken);
            response.put("tokenType", "Bearer");
            
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Invalid refresh token");
        }
    }
    
    private void validateRegisterRequest(RegisterRequest request) {
        Set<ConstraintViolation<RegisterRequest>> violations = validator.validate(request);
        if (!violations.isEmpty()) {
            String errorMessage = violations.stream()
                    .map(ConstraintViolation::getMessage)
                    .collect(Collectors.joining(", "));
            throw new IllegalArgumentException(errorMessage);
        }
    }

    public User register(RegisterRequest request) {
        validateRegisterRequest(request);
        
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(Role.USER); // Default role is USER
        
        return userRepository.save(user);
    }
    
    public void logout(String refreshToken) {
        // JWT tokens are stateless - logout is primarily client-side
        // Client should delete tokens from localStorage
        
        // In a production system, you might:
        // 1. Add refresh token to blacklist (Redis/database)
        // 2. Maintain a revoked tokens list
        // 3. Implement token rotation with invalidation
        
        // For now, this is a placeholder for future token blacklisting
        // The actual logout happens when client deletes stored tokens
    }
    
}
