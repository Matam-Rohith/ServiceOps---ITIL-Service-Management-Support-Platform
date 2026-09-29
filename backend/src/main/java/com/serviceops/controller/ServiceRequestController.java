package com.serviceops.controller;

import com.serviceops.dto.ApprovalDecisionRequest;
import com.serviceops.dto.ServiceRequestCreateDto;
import com.serviceops.dto.ServiceRequestResponse;
import com.serviceops.service.ServiceRequestService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-requests")
@Tag(name = "Service Requests", description = "Service requests and manager approval workflows")
public class ServiceRequestController {

    private final ServiceRequestService requestService;

    public ServiceRequestController(ServiceRequestService requestService) {
        this.requestService = requestService;
    }

    @PostMapping
    @Operation(summary = "Submit a service catalog order")
    public ResponseEntity<ServiceRequestResponse> createRequest(
            @Valid @RequestBody ServiceRequestCreateDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        ServiceRequestResponse created = requestService.createRequest(dto, userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @GetMapping
    @Operation(summary = "List service requests")
    public ResponseEntity<List<ServiceRequestResponse>> getRequests(
            @RequestParam(required = false) String requesterId) {
        return ResponseEntity.ok(requestService.getAllRequests(requesterId));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SERVICE_MANAGER', 'ADMIN')")
    @Operation(summary = "Approve or reject a service request (Managers/Admins)")
    public ResponseEntity<ServiceRequestResponse> processApproval(
            @PathVariable String id,
            @Valid @RequestBody ApprovalDecisionRequest decision,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(requestService.processApproval(id, decision, userDetails.getUsername()));
    }

    @PatchMapping("/{id}/status")
    @Operation(summary = "Transition fulfillment lifecycle state")
    public ResponseEntity<ServiceRequestResponse> updateStatus(
            @PathVariable String id,
            @RequestParam String status) {
        return ResponseEntity.ok(requestService.updateStatus(id, status));
    }
}
