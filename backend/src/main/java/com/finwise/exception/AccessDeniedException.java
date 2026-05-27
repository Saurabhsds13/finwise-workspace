package com.finwise.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a user attempts to access a resource they don't own or have permission for.
 */
public class AccessDeniedException extends BaseException {

    private static final String ERROR_CODE = "ACCESS_DENIED";

    public AccessDeniedException(String message) {
        super(message, ERROR_CODE, HttpStatus.FORBIDDEN);
    }

    public AccessDeniedException(String resource, String resourceId, String userId) {
        super(
                String.format("User %s does not have access to %s with id: %s", userId, resource, resourceId),
                ERROR_CODE,
                HttpStatus.FORBIDDEN
        );
    }
}
