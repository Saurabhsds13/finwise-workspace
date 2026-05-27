package com.finwise.service.impl;

import com.finwise.dto.auth.AuthResponse;
import com.finwise.dto.auth.LoginRequest;
import com.finwise.dto.auth.RegisterRequest;
import com.finwise.entity.RefreshToken;
import com.finwise.entity.User;
import com.finwise.exception.AuthException;
import com.finwise.exception.BusinessException;
import com.finwise.exception.ErrorCodes;
import com.finwise.mapper.AuthMapper;
import com.finwise.repository.RefreshTokenRepository;
import com.finwise.repository.UserRepository;
import com.finwise.security.JwtUtil;
import com.finwise.service.AuthService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * Authentication service implementation.
 *
 * SOLID principles applied:
 * - SRP: Only handles authentication logic
 * - OCP: New auth methods (OAuth, SSO) can be added without modifying existing code
 * - DIP: Depends on abstractions (interfaces) not concrete implementations
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthMapper authMapper;

    @Override
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        log.info("Registration attempt for email: {}", request.getEmail());

        if (userRepository.existsByEmail(request.getEmail())) {
            log.warn("Registration failed - email already exists: {}", request.getEmail());
            throw new BusinessException("Email already registered", ErrorCodes.EMAIL_ALREADY_EXISTS);
        }

        User user = authMapper.toEntity(request, passwordEncoder.encode(request.getPassword()));
        user = userRepository.save(user);

        log.info("User registered successfully: {}", user.getId());
        return generateAuthResponse(user);
    }

    @Override
    @Transactional
    public AuthResponse login(LoginRequest request) {
        log.info("Login attempt for email: {}", request.getEmail());

        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    log.warn("Login failed - user not found: {}", request.getEmail());
                    return new AuthException("Invalid email or password", ErrorCodes.INVALID_CREDENTIALS);
                });

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            log.warn("Login failed - invalid password for user: {}", user.getId());
            throw new AuthException("Invalid email or password", ErrorCodes.INVALID_CREDENTIALS);
        }

        // Invalidate existing refresh tokens (single session enforcement)
        refreshTokenRepository.deleteByUserId(user.getId());

        log.info("User logged in successfully: {}", user.getId());
        return generateAuthResponse(user);
    }

    @Override
    @Transactional
    public void logout(String token) {
        String cleanToken = extractToken(token);

        if (cleanToken != null && jwtUtil.validateToken(cleanToken)) {
            String userId = jwtUtil.getUserIdFromToken(cleanToken);
            refreshTokenRepository.deleteByUserId(userId);
            log.info("User logged out: {}", userId);
        }
    }

    private AuthResponse generateAuthResponse(User user) {
        String accessToken = jwtUtil.generateAccessToken(user.getId(), user.getEmail());
        String refreshToken = jwtUtil.generateRefreshToken(user.getId());

        persistRefreshToken(user, refreshToken);

        return authMapper.toAuthResponse(user, accessToken, refreshToken);
    }

    private void persistRefreshToken(User user, String token) {
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(token)
                .expiresAt(LocalDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);
    }

    private String extractToken(String bearerToken) {
        if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return bearerToken;
    }
}
