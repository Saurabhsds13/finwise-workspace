package com.finwise.exception;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.MissingServletRequestParameterException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.method.annotation.MethodArgumentTypeMismatchException;
import org.springframework.web.servlet.resource.NoResourceFoundException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

/**
 * Centralized exception handler for the entire application.
 * Converts all exceptions into a consistent {@link ErrorResponse} structure.
 *
 * Design principles:
 * - Single Responsibility: Only handles exception-to-response mapping
 * - Open/Closed: New exceptions extend BaseException without modifying this class
 * - Consistent: Every error response follows the same structure
 * - Traceable: Every error gets a unique traceId for log correlation
 */
@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    // ==================== APPLICATION EXCEPTIONS ====================

    /**
     * Handles all custom application exceptions that extend BaseException.
     * This single handler covers ResourceNotFoundException, AuthException,
     * BusinessException, AccessDeniedException, and any future custom exceptions.
     */
    @ExceptionHandler(BaseException.class)
    public ResponseEntity<ErrorResponse> handleBaseException(BaseException ex, HttpServletRequest request) {
        String traceId = generateTraceId();

        log.warn("[{}] {} - {} (path: {})", traceId, ex.getErrorCode(), ex.getMessage(), request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(ex.getHttpStatus().value())
                .errorCode(ex.getErrorCode())
                .message(ex.getMessage())
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(ex.getHttpStatus()).body(response);
    }

    // ==================== SPRING SECURITY EXCEPTIONS ====================

    @ExceptionHandler(BadCredentialsException.class)
    public ResponseEntity<ErrorResponse> handleBadCredentials(BadCredentialsException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.warn("[{}] Bad credentials attempt (path: {})", traceId, request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.UNAUTHORIZED.value())
                .errorCode("INVALID_CREDENTIALS")
                .message("Invalid email or password")
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
    }

    @ExceptionHandler(org.springframework.security.access.AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleSpringAccessDenied(
            org.springframework.security.access.AccessDeniedException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.warn("[{}] Access denied (path: {})", traceId, request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.FORBIDDEN.value())
                .errorCode("ACCESS_DENIED")
                .message("You do not have permission to access this resource")
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
    }

    // ==================== VALIDATION EXCEPTIONS ====================

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(MethodArgumentNotValidException ex, HttpServletRequest request) {
        String traceId = generateTraceId();

        List<ErrorResponse.FieldValidationError> fieldErrors = ex.getBindingResult().getAllErrors().stream()
                .map(error -> {
                    String field = error instanceof FieldError fe ? fe.getField() : error.getObjectName();
                    Object rejectedValue = error instanceof FieldError fe ? fe.getRejectedValue() : null;
                    return ErrorResponse.FieldValidationError.builder()
                            .field(field)
                            .message(error.getDefaultMessage())
                            .rejectedValue(rejectedValue)
                            .build();
                })
                .toList();

        log.warn("[{}] Validation failed with {} errors (path: {})", traceId, fieldErrors.size(), request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("VALIDATION_FAILED")
                .message("Request validation failed")
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .errors(fieldErrors)
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(MissingServletRequestParameterException.class)
    public ResponseEntity<ErrorResponse> handleMissingParam(MissingServletRequestParameterException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.warn("[{}] Missing parameter: {} (path: {})", traceId, ex.getParameterName(), request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("MISSING_PARAMETER")
                .message(String.format("Required parameter '%s' is missing", ex.getParameterName()))
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(MethodArgumentTypeMismatchException.class)
    public ResponseEntity<ErrorResponse> handleTypeMismatch(MethodArgumentTypeMismatchException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.warn("[{}] Type mismatch for parameter: {} (path: {})", traceId, ex.getName(), request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("TYPE_MISMATCH")
                .message(String.format("Parameter '%s' has invalid type", ex.getName()))
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    // ==================== HTTP EXCEPTIONS ====================

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<ErrorResponse> handleUnreadable(HttpMessageNotReadableException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.warn("[{}] Malformed request body (path: {})", traceId, request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("MALFORMED_REQUEST")
                .message("Request body is missing or malformed")
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMethodNotAllowed(HttpRequestMethodNotSupportedException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.warn("[{}] Method {} not allowed (path: {})", traceId, ex.getMethod(), request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.METHOD_NOT_ALLOWED.value())
                .errorCode("METHOD_NOT_ALLOWED")
                .message(String.format("HTTP method '%s' is not supported for this endpoint", ex.getMethod()))
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.METHOD_NOT_ALLOWED).body(response);
    }

    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ResponseEntity<ErrorResponse> handleMediaTypeNotSupported(HttpMediaTypeNotSupportedException ex, HttpServletRequest request) {
        String traceId = generateTraceId();

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.UNSUPPORTED_MEDIA_TYPE.value())
                .errorCode("UNSUPPORTED_MEDIA_TYPE")
                .message(String.format("Content type '%s' is not supported", ex.getContentType()))
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.UNSUPPORTED_MEDIA_TYPE).body(response);
    }

    @ExceptionHandler(NoResourceFoundException.class)
    public ResponseEntity<ErrorResponse> handleNoResourceFound(NoResourceFoundException ex, HttpServletRequest request) {
        String traceId = generateTraceId();

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.NOT_FOUND.value())
                .errorCode("ENDPOINT_NOT_FOUND")
                .message("The requested endpoint does not exist")
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(response);
    }

    // ==================== DATA EXCEPTIONS ====================

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<ErrorResponse> handleDataIntegrity(DataIntegrityViolationException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.error("[{}] Data integrity violation (path: {}): {}", traceId, request.getRequestURI(), ex.getMostSpecificCause().getMessage());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.CONFLICT.value())
                .errorCode("DATA_CONFLICT")
                .message("The operation conflicts with existing data")
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(IllegalArgumentException ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.warn("[{}] Illegal argument: {} (path: {})", traceId, ex.getMessage(), request.getRequestURI());

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.BAD_REQUEST.value())
                .errorCode("INVALID_ARGUMENT")
                .message(ex.getMessage())
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.badRequest().body(response);
    }

    // ==================== CATCH-ALL ====================

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnexpected(Exception ex, HttpServletRequest request) {
        String traceId = generateTraceId();
        log.error("[{}] Unexpected error (path: {}): ", traceId, request.getRequestURI(), ex);

        ErrorResponse response = ErrorResponse.builder()
                .status(HttpStatus.INTERNAL_SERVER_ERROR.value())
                .errorCode("INTERNAL_ERROR")
                .message("An unexpected error occurred. Please try again later.")
                .traceId(traceId)
                .path(request.getRequestURI())
                .timestamp(LocalDateTime.now())
                .build();

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }

    // ==================== HELPERS ====================

    private String generateTraceId() {
        return UUID.randomUUID().toString().replace("-", "").substring(0, 16);
    }
}
