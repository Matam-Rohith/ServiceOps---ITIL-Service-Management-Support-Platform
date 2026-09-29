package com.serviceops.dto;

import jakarta.validation.constraints.NotNull;

public record ApprovalDecisionRequest(
    @NotNull(message = "Approval decision is required")
    boolean approved,

    String comments
) {}
