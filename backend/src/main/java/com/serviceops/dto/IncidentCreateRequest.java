package com.serviceops.dto;

import com.serviceops.entity.Impact;
import com.serviceops.entity.Urgency;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record IncidentCreateRequest(
    @NotBlank(message = "Incident title is required")
    @Size(max = 200, message = "Title cannot exceed 200 characters")
    String title,

    @NotBlank(message = "Description is required")
    String description,

    @NotBlank(message = "Category is required")
    String category,

    String subcategory,

    @NotNull(message = "Impact level is required")
    Impact impact,

    @NotNull(message = "Urgency level is required")
    Urgency urgency,

    String source, // PORTAL, EMAIL, PHONE, MONITORING

    String assignmentGroup,
    String assignedAgentId,
    String affectedAssetId,
    String affectedService
) {}
