package com.finwise.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown for authentication failures (invalid credentials, expired tokens, etc.)
 */
public class AuthException extends BaseException {

    private static final String DEFAULT_ERROR_CODE = "AUTH_FAILED";

    public AuthException(String message) {
        super(message, DEFAULT_ERROR_CODE, HttpStatus.UNAUTHORIZED);
    }

    public AuthException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.UNAUTHORIZED);
    }
}
