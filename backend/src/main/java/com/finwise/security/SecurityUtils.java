package com.finwise.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * Utility class to extract the current authenticated user's information
 * from the Spring Security context.
 */
public final class SecurityUtils {

    private SecurityUtils() {
        // Utility class, no instantiation
    }

    /**
     * Get the current authenticated user's ID from the security context.
     */
    public static String getCurrentUserId() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getId();
        }

        throw new RuntimeException("Unable to extract user ID from security context");
    }

    /**
     * Get the current authenticated user's email from the security context.
     */
    public static String getCurrentUserEmail() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated()) {
            throw new RuntimeException("No authenticated user found");
        }

        Object principal = authentication.getPrincipal();
        if (principal instanceof CustomUserDetails userDetails) {
            return userDetails.getEmail();
        }

        throw new RuntimeException("Unable to extract email from security context");
    }
}
