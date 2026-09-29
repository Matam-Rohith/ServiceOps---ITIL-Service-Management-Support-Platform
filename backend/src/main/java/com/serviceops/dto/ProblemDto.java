package com.serviceops.dto;

import com.serviceops.entity.ProblemStatus;
import java.time.Instant;
import java.util.List;

public record ProblemDto(
    String id,
    String problemNumber,
    String title,
    String description,
    String category,
    String assignedTeam,
    String assignedAgentName,
    String rootCause,
    String workaround,
    boolean isKnownError,
    ProblemStatus status,
    List<String> relatedIncidentIds,
    Instant createdAt,
    Instant updatedAt,
    Instant resolvedAt
) {}
