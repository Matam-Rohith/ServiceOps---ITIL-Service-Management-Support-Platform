package com.serviceops.controller;

import com.serviceops.entity.ServiceCatalogItem;
import com.serviceops.repository.ServiceCatalogItemRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/service-catalog")
@Tag(name = "Service Catalog", description = "Pre-approved and requestable IT service catalog items")
public class ServiceCatalogController {

    private final ServiceCatalogItemRepository catalogRepository;

    public ServiceCatalogController(ServiceCatalogItemRepository catalogRepository) {
        this.catalogRepository = catalogRepository;
    }

    @GetMapping
    @Operation(summary = "Get published service catalog items")
    public ResponseEntity<List<ServiceCatalogItem>> getCatalogItems(
            @RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(catalogRepository.findByCategoryAndActiveTrue(category));
        }
        return ResponseEntity.ok(catalogRepository.findByActiveTrue());
    }
}
