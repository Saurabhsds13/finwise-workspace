package com.finwise.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

/**
 * Base exception class for all FinWise application exceptions.
 * Follows the Template Method pattern — subclasses define their own
 * HTTP status and error code while inheriting consistent behavior.
 */
@Getter
public abstract class BaseException extends RuntimeException {

    private final String errorCode;
    private final HttpStatus httpStatus;

    protected BaseException(String message, String errorCode, HttpStatus httpStatus) {
        super(message);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }

    protected BaseException(String message, String errorCode, HttpStatus httpStatus, Throwable cause) {
        super(message, cause);
        this.errorCode = errorCode;
        this.httpStatus = httpStatus;
    }
}
