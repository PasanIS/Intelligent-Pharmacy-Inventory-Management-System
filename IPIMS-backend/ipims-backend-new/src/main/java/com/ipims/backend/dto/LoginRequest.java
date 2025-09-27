package com.ipims.backend.dto;

import lombok.Data;
import jakarta.validation.constraints.NotBlank;

@Data
public class LoginRequest {

    // The user logs in with their email
    @NotBlank
    private String email;

    @NotBlank
    private String password;
}
