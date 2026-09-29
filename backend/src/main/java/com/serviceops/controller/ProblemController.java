package com.serviceops.controller;

import com.serviceops.dto.ProblemDto;
import com.serviceops.service.ProblemService;
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
@RequestMapping("/api/problems")
@Tag(name = "Problem Management", description = "Root Cause Analysis and Known Error Database (KEDB)")
@PreAuthorize("hasAnyRole('SERVICE_AGENT', 'SERVICE_MANAGER', 'ADMIN')")
public class ProblemController {

    private final ProblemService problemService;

    public ProblemController(ProblemService problemService) {
        this.problemService = problemService;
    }

    @GetMapping
    @Operation(summary = "Get all problem records")
    public ResponseEntity<List<ProblemDto>> getProblems() {
        return ResponseEntity.ok(problemService.getAllProblems());
    }

    @PostMapping
    @Operation(summary = "Create an ITIL problem investigation record")
    public ResponseEntity<ProblemDto> createProblem(
            @RequestBody ProblemDto dto,
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.status(HttpStatus.CREATED).body(problemService.createProblem(dto, userDetails.getUsername()));
    }

    @PatchMapping("/{id}")
    @Operation(summary = "Update root cause, workaround, or KEDB status")
    public ResponseEntity<ProblemDto> updateProblem(
            @PathVariable String id,
            @RequestBody ProblemDto dto) {
        return ResponseEntity.ok(problemService.updateProblem(id, dto));
    }

    @PostMapping("/{id}/link-incident/{incidentId}")
    @Operation(summary = "Link a recurring incident to a problem record")
    public ResponseEntity<ProblemDto> linkIncident(
            @PathVariable String id,
            @PathVariable String incidentId) {
        return ResponseEntity.ok(problemService.linkIncident(id, incidentId));
    }
}
