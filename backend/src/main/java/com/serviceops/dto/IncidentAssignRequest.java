package com.serviceops.dto;

public record IncidentAssignRequest(
    String assignedAgentId,
    String assignmentGroup
) {}
