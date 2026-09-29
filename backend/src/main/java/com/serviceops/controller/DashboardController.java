package com.serviceops.controller;

import com.serviceops.dto.DashboardMetricsDto;
import com.serviceops.service.DashboardService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/dashboard")
@Tag(name = "Dashboard & Operational Metrics", description = "Aggregated ITSM metrics, MTTR, MTTA, and SLA analytics")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/metrics")
    @Operation(summary = "Get live operational ITSM metrics")
    public ResponseEntity<DashboardMetricsDto> getMetrics() {
        return ResponseEntity.ok(dashboardService.getMetrics());
    }
}
