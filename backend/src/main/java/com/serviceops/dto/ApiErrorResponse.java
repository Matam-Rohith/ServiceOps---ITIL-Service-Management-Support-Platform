package com.serviceops.dto;

import java.time.Instant;
import java.util.Map;

public record ApiErrorResponse(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path,
    Map<String, String> details
) {
    public ApiErrorResponse(int status, String error, String message, String path, Map<String, String> details) {
        this(Instant.now(), status, error, message, path, details);
    }
}
