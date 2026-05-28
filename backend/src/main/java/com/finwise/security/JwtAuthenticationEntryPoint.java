package com.finwise.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import com.finwise.exception.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Handles unauthorized access attempts (missing or invalid JWT).
 * Returns a consistent JSON error response instead of Spring's default HTML page.
 */
@Slf4j
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    private final ObjectMapper objectMapper;

    public JwtAuthenticationEntryPoint() {
        this.objectMapper = new ObjectMapper();
        this.objectMapper.registerModule(new JavaTimeModule());
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {

        String traceId = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        log.warn("[{}] Unauthorized access attempt: {} (path: {})", traceId, authException.getMessage(), request.getRequestURI());

        ErrorResponse errorResponse = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .errorCode("AUTH_REQUIRED")
                .message("Authentication is required to access this resource")
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        objectMapper.writeValue(response.getOutputStream(), errorResponse);
    }
}
