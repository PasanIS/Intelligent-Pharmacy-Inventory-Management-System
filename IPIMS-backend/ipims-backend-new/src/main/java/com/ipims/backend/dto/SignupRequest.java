package com.ipims.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

@Data
public class SignupRequest {

    @NotBlank
    private String fullName;

    @NotBlank
    @Email
    private String email;

    @NotBlank
    private String password;

    // Note: ModelMapper will skip this field if it's not in the Entity,
    private String confirmPassword;
}
