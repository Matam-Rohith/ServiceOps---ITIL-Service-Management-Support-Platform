package com.serviceops.dto;

import com.serviceops.entity.*;
import java.time.Instant;

public record ChangeRequestDto(
    String id,
    String changeNumber,
    String title,
    String description,
    String reason,
    ChangeType changeType,
    ChangeRisk risk,
    Impact impact,
    String affectedService,
    String implementationPlan,
    String rollbackPlan,
    String testPlan,
    String requesterName,
    String assignedOwnerName,
    ApprovalStatus approvalStatus,
    String approverName,
    String approvalComments,
    String implementationStatus,
    Instant scheduledStart,
    Instant scheduledEnd,
    Instant createdAt,
    Instant updatedAt
) {}
