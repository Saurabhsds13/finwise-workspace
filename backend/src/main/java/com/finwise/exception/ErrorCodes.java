package com.finwise.exception;

/**
 * Centralized error code constants.
 * Frontend can use these codes to display appropriate messages or take actions.
 */
public final class ErrorCodes {

    private ErrorCodes() {
        // Utility class
    }

    // Authentication
    public static final String AUTH_FAILED = "AUTH_FAILED";
    public static final String INVALID_CREDENTIALS = "INVALID_CREDENTIALS";
    public static final String TOKEN_EXPIRED = "TOKEN_EXPIRED";
    public static final String TOKEN_INVALID = "TOKEN_INVALID";

    // Authorization
    public static final String ACCESS_DENIED = "ACCESS_DENIED";

    // Resources
    public static final String RESOURCE_NOT_FOUND = "RESOURCE_NOT_FOUND";

    // Business Rules
    public static final String EMAIL_ALREADY_EXISTS = "EMAIL_ALREADY_EXISTS";
    public static final String BUDGET_PERIOD_OVERLAP = "BUDGET_PERIOD_OVERLAP";
    public static final String GOAL_ALREADY_COMPLETED = "GOAL_ALREADY_COMPLETED";
    public static final String INSUFFICIENT_AMOUNT = "INSUFFICIENT_AMOUNT";

    // Validation
    public static final String VALIDATION_FAILED = "VALIDATION_FAILED";
    public static final String MISSING_PARAMETER = "MISSING_PARAMETER";
    public static final String INVALID_ARGUMENT = "INVALID_ARGUMENT";
    public static final String MALFORMED_REQUEST = "MALFORMED_REQUEST";
    public static final String TYPE_MISMATCH = "TYPE_MISMATCH";

    // Data
    public static final String DATA_CONFLICT = "DATA_CONFLICT";

    // System
    public static final String INTERNAL_ERROR = "INTERNAL_ERROR";
    public static final String METHOD_NOT_ALLOWED = "METHOD_NOT_ALLOWED";
    public static final String UNSUPPORTED_MEDIA_TYPE = "UNSUPPORTED_MEDIA_TYPE";
    public static final String ENDPOINT_NOT_FOUND = "ENDPOINT_NOT_FOUND";
}
