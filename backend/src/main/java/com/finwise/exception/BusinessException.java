package com.finwise.exception;

import org.springframework.http.HttpStatus;

/**
 * Thrown when a business rule is violated.
 * Examples: duplicate email, budget exceeded, invalid state transition.
 */
public class BusinessException extends BaseException {

    public BusinessException(String message, String errorCode) {
        super(message, errorCode, HttpStatus.UNPROCESSABLE_ENTITY);
    }

    public BusinessException(String message, String errorCode, HttpStatus httpStatus) {
        super(message, errorCode, httpStatus);
    }
}
