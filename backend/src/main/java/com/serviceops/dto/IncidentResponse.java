package com.serviceops.dto;

import com.serviceops.entity.*;
import java.time.Instant;

public record IncidentResponse(
    String id,
    Long version,
    String incidentNumber,
    String title,
    String description,
    UserDto requester,
    UserDto assignedAgent,
    String assignmentGroup,
    String category,
    String subcategory,
    Impact impact,
    Urgency urgency,
    Priority priority,
    IncidentStatus status,
    String source,
    String affectedAssetId,
    String affectedAssetName,
    String affectedService,
    String relatedProblemId,
    String resolutionNotes,
    String pendingReason,
    // SLA Details
    String slaPolicyName,
    Instant responseDeadline,
    Instant resolutionDeadline,
    boolean responseBreached,
    boolean resolutionBreached,
    SlaStatus slaStatus,
    long resolutionElapsedMinutes,
    long remainingMinutesToDeadline,
    // Milestones
    Instant createdAt,
    Instant updatedAt,
    Instant firstResponseAt,
    Instant resolvedAt,
    Instant closedAt
) {}
