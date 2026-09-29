package com.serviceops.dto;

import com.serviceops.entity.ApprovalStatus;
import java.time.Instant;
import java.util.Map;

public record ServiceRequestResponse(
    String id,
    String requestNumber,
    String catalogItemId,
    String catalogItemName,
    UserDto requester,
    UserDto assignedAgent,
    String assignmentGroup,
    String status,
    ApprovalStatus approvalStatus,
    String approverName,
    Instant approvalDecisionAt,
    String approvalComments,
    String justification,
    Map<String, String> formData,
    Instant expectedFulfillmentAt,
    Instant createdAt,
    Instant updatedAt,
    Instant resolvedAt
) {}
