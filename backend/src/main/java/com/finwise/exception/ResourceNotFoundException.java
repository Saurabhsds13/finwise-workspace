package com.finwise.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a requested resource does not exist.
 */
public class ResourceNotFoundException extends BaseException {

    private static final String ERROR_CODE = "RESOURCE_NOT_FOUND";

    public ResourceNotFoundException(String message) {
        super(message, ERROR_CODE, HttpStatus.NOT_FOUND);
    }

    public ResourceNotFoundException(String resource, String id) {
        super(String.format("%s not found with id: %s", resource, id), ERROR_CODE, HttpStatus.NOT_FOUND);
    }
}
