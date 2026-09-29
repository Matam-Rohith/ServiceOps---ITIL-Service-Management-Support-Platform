package com.serviceops.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.Map;

public record ServiceRequestCreateDto(
    @NotBlank(message = "Catalog item ID is required")
    String catalogItemId,

    @NotBlank(message = "Business justification is required")
    String justification,

    Map<String, String> formData
) {}
