package com.finwise.exception;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

/**
 * Standardized API error response following RFC 7807 (Problem Details) principles.
 * Every error response from the API follows this exact structure.
 */
@Getter
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ErrorResponse {

    /** HTTP status code */
    private final int status;

    /** Machine-readable error code for frontend handling */
    private final String errorCode;

    /** Human-readable error message */
    private final String message;

    /** Correlation ID for tracing across logs */
    private final String traceId;

    /** API path that generated the error */
    private final String path;

    /** Timestamp of the error */
    private final LocalDateTime timestamp;

    /** Field-level validation errors (only for 400 validation failures) */
    private final List<FieldValidationError> errors;

    @Getter
    @Builder
    public static class FieldValidationError {
        private final String field;
        private final String message;
        private final Object rejectedValue;
    }
}
