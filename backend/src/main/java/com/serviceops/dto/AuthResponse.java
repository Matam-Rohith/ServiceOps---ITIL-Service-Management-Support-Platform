package com.serviceops.dto;

public record AuthResponse(
    String token,
    String tokenType,
    long expiresInMs,
    UserDto user
) {
    public AuthResponse(String token, long expiresInMs, UserDto user) {
        this(token, "Bearer", expiresInMs, user);
    }
}
