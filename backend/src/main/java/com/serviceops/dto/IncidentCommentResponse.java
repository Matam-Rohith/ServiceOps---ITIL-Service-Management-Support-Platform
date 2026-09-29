package com.serviceops.dto;

import com.serviceops.entity.Role;
import java.time.Instant;

public record IncidentCommentResponse(
    String id,
    String incidentId,
    String authorId,
    String authorName,
    Role authorRole,
    String content,
    boolean isInternalWorkNote,
    Instant createdAt
) {}
