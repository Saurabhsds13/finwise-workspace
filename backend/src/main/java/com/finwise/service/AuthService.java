package com.finwise.service;

import com.finwise.dto.auth.LoginRequest;
import com.finwise.dto.auth.RegisterRequest;
import com.finwise.dto.auth.AuthResponse;

public interface AuthService {
    AuthResponse login(LoginRequest request);
    AuthResponse register(RegisterRequest request);
    void logout(String token);
}
