package com.ipims.backend.dto;

import lombok.*;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private String token;
    private String type = "Bearer";
    private Long id;
    private String email;
    private String fullName;

    public AuthResponse(String accessToken, Long id, String email, String fullName) {
        this.token = accessToken;
        this.id = id;
        this.email = email;
        this.fullName = fullName;
    }
}
