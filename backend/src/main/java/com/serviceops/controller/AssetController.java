package com.serviceops.controller;

import com.serviceops.dto.AssetDto;
import com.serviceops.service.AssetService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assets")
@Tag(name = "CMDB & Assets", description = "Configuration Item inventory and asset management")
@PreAuthorize("hasAnyRole('SERVICE_AGENT', 'SERVICE_MANAGER', 'ADMIN')")
public class AssetController {

    private final AssetService assetService;

    public AssetController(AssetService assetService) {
        this.assetService = assetService;
    }

    @GetMapping
    @Operation(summary = "List all CMDB configuration items")
    public ResponseEntity<List<AssetDto>> getAssets() {
        return ResponseEntity.ok(assetService.getAllAssets());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Register a new CI asset in CMDB (Admin only)")
    public ResponseEntity<AssetDto> createAsset(@RequestBody AssetDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(assetService.createAsset(dto));
    }
}
