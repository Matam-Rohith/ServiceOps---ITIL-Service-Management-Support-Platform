package com.serviceops.controller;

import com.serviceops.dto.*;
import com.serviceops.entity.IncidentStatus;
import com.serviceops.service.IncidentService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/incidents")
@Tag(name = "Incident Management", description = "ITIL Incident Lifecycle, SLA tracking, and Assignment")
public class IncidentController {

    private final IncidentService incidentService;

    public IncidentController(IncidentService incidentService) {
        this.incidentService = incidentService;
    }

    @PostMapping
    @Operation(summary = "Submit new incident ticket", description = "Calculates priority matrix and creates authoritative SLA deadline")
    public ResponseEntity<IncidentResponse> createIncident(
            @Valid @RequestBody IncidentCreateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        IncidentResponse created = incidentService.createIncident(request, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "List incident tickets", description = "Filter by status or view active queue")
    public ResponseEntity<List<IncidentResponse>> getIncidents(
            @RequestParam(required = false) IncidentStatus status,
            @RequestParam(required = false) String requesterId) {
        return ResponseEntity.ok(incidentService.getAllIncidents(requesterId, status));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get incident details by ID")
    public ResponseEntity<IncidentResponse> getIncident(@PathVariable String id) {
        return ResponseEntity.ok(incidentService.getIncidentById(id));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Transition incident status lifecycle", description = "Supports NEW, ASSIGNED, IN_PROGRESS, PENDING, RESOLVED, CLOSED")
    public ResponseEntity<IncidentResponse> updateStatus(
            @PathVariable String id,
            @Valid @RequestBody IncidentStatusUpdateRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(incidentService.updateStatus(id, request.status(), request.notes(), userDetails.getUsername()));
    }

    @PatchMapping("/{id}/assign")
    @Operation(summary = "Assign ticket to agent or group")
    public ResponseEntity<IncidentResponse> assignIncident(
            @PathVariable String id,
            @RequestBody IncidentAssignRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(incidentService.assignIncident(id, request.assignedAgentId(), request.assignmentGroup(), userDetails.getUsername()));
    }

    @PostMapping("/{id}/comments")
    @Operation(summary = "Post public comment or internal work note")
    public ResponseEntity<IncidentCommentResponse> addComment(
            @PathVariable String id,
            @Valid @RequestBody IncidentCommentRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        IncidentCommentResponse comment = incidentService.addComment(
                id,
                request.content(),
                request.isInternalWorkNote(),
                userDetails.getUsername()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(comment);
    }
}
