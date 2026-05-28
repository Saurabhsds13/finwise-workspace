package com.finwise.dto.auth;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class UpdateProfileRequest {
    @NotBlank
    private String firstName;

    @NotBlank
    private String lastName;
}
