package com.serviceops.dto;

import com.serviceops.entity.IncidentStatus;
import com.serviceops.entity.Priority;
import java.util.List;
import java.util.Map;

public record DashboardMetricsDto(
    long openIncidents,
    long criticalIncidents,
    long breachedSlaCount,
    int slaCompliancePercentage,
    double avgResolutionHours,
    long avgFirstResponseMinutes,
    long openRequests,
    long pendingApprovals,
    long activeProblems,
    long scheduledChanges,
    Map<Priority, Long> byPriority,
    Map<IncidentStatus, Long> byStatus,
    Map<String, Long> byCategory
) {}
