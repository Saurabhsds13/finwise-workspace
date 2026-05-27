package com.finwise.security;

import com.finwise.entity.User;
import com.finwise.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String userIdOrEmail) throws UsernameNotFoundException {
        // First try to find by ID (used by JWT filter)
        User user = userRepository.findById(userIdOrEmail)
                .orElseGet(() ->
                        // Fallback to email lookup (used during login)
                        userRepository.findByEmail(userIdOrEmail)
                                .orElseThrow(() -> new UsernameNotFoundException(
                                        "User not found: " + userIdOrEmail
                                ))
                );

        return CustomUserDetails.fromUser(user);
    }
}
