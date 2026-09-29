package com.serviceops.dto;

import com.serviceops.entity.AssetStatus;
import com.serviceops.entity.AssetType;

public record AssetDto(
    String id,
    String assetTag,
    String name,
    AssetType type,
    AssetStatus status,
    String ownerName,
    String department,
    String location,
    String serialNumber,
    String purchaseDate,
    String warrantyExpiry,
    String description,
    String associatedService
) {}
