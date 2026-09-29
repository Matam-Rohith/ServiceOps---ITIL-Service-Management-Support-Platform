package com.serviceops.dto;

import jakarta.validation.constraints.NotBlank;

public record IncidentCommentRequest(
    @NotBlank(message = "Comment content cannot be empty")
    String content,

    boolean isInternalWorkNote
) {}
