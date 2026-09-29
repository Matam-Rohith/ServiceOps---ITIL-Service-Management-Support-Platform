package com.serviceops.controller;

import com.serviceops.dto.ChangeRequestDto;
import com.serviceops.service.ChangeService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/changes")
@Tag(name = "Change Enablement", description = "ITIL Change Advisory Board (CAB) reviews and RFC tracking")
@PreAuthorize("hasAnyRole('SERVICE_AGENT', 'SERVICE_MANAGER', 'ADMIN')")
public class ChangeController {

    private final ChangeService changeService;

    public ChangeController(ChangeService changeService) {
        this.changeService = changeService;
    }

    @GetMapping
    @Operation(summary = "List all Requests for Change (RFCs)")
    public ResponseEntity<List<ChangeRequestDto>> getChanges() {
        return ResponseEntity.ok(changeService.getAllChanges());
    }

    @PostMapping
    @Operation(summary = "Submit a new RFC change proposal")
    public ResponseEntity<ChangeRequestDto> createChange(
            @RequestBody ChangeRequestDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(changeService.createChange(dto, userDetails.getUsername()));
    }

    @PostMapping("/{id}/approve")
    @PreAuthorize("hasAnyRole('SERVICE_MANAGER', 'ADMIN')")
    @Operation(summary = "CAB approval of change release")
    public ResponseEntity<ChangeRequestDto> approveChange(
            @PathVariable String id,
            @RequestParam(defaultValue = "CAB Approved") String comments,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(changeService.approveChange(id, comments, userDetails.getUsername()));
    }
}
