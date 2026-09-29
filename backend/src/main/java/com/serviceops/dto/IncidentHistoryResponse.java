package com.serviceops.dto;

import java.time.Instant;

public record IncidentHistoryResponse(
    String id,
    String incidentId,
    String actorName,
    String action,
    String fieldName,
    String oldValue,
    String newValue,
    Instant createdAt
) {}
