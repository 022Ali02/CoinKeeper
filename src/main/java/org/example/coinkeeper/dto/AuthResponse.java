package org.example.coinkeeper.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AuthResponse {
    private String token;
    private String email;

    public AuthResponse(String token, String email) {
        this.token = token;
        this.email = email;
    }
}