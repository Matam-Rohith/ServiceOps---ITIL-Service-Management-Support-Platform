package com.serviceops.dto;

import com.serviceops.entity.IncidentStatus;
import jakarta.validation.constraints.NotNull;

public record IncidentStatusUpdateRequest(
    @NotNull(message = "New incident status is required")
    IncidentStatus status,

    String notes // Resolution notes if RESOLVED, or reason if PENDING
) {}
