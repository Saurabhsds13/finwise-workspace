package com.finwise.mapper;

import com.finwise.dto.auth.AuthResponse;
import com.finwise.dto.auth.RegisterRequest;
import com.finwise.entity.User;
import org.springframework.stereotype.Component;

/**
 * Maps between User entity and Auth DTOs.
 */
@Component
public class AuthMapper {

    public AuthResponse toAuthResponse(User user, String accessToken, String refreshToken) {
        return AuthResponse.builder()
                .token(accessToken)
                .refreshToken(refreshToken)
                .user(toUserDto(user))
                .build();
    }

    public AuthResponse.UserDto toUserDto(User user) {
        return AuthResponse.UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .firstName(user.getFirstName())
                .lastName(user.getLastName())
                .build();
    }

    public User toEntity(RegisterRequest request, String encodedPassword) {
        return User.builder()
                .email(request.getEmail())
                .password(encodedPassword)
                .firstName(request.getFirstName())
                .lastName(request.getLastName())
                .build();
    }
}
