package com.serviceops.service;

import com.serviceops.dto.AssetDto;
import com.serviceops.entity.Asset;
import com.serviceops.exception.ResourceNotFoundException;
import com.serviceops.repository.AssetRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class AssetService {

    private final AssetRepository assetRepository;

    public AssetService(AssetRepository assetRepository) {
        this.assetRepository = assetRepository;
    }

    @Transactional
    public AssetDto createAsset(AssetDto dto) {
        String id = UUID.randomUUID().toString();
        long nextNum = assetRepository.count() + 4001;
        String tag = "AST-" + nextNum;

        Asset a = new Asset();
        a.setId(id);
        a.setAssetTag(tag);
        a.setName(dto.name());
        a.setType(dto.type());
        a.setStatus(dto.status());
        a.setOwnerName(dto.ownerName());
        a.setDepartment(dto.department());
        a.setLocation(dto.location());
        a.setSerialNumber(dto.serialNumber() != null ? dto.serialNumber() : "SN-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        a.setPurchaseDate(dto.purchaseDate());
        a.setWarrantyExpiry(dto.warrantyExpiry());
        a.setDescription(dto.description());
        a.setAssociatedService(dto.associatedService());

        return toDto(assetRepository.save(a));
    }

    @Transactional(readOnly = true)
    public List<AssetDto> getAllAssets() {
        return assetRepository.findAll().stream().map(this::toDto).toList();
    }

    private AssetDto toDto(Asset a) {
        return new AssetDto(
                a.getId(),
                a.getAssetTag(),
                a.getName(),
                a.getType(),
                a.getStatus(),
                a.getOwnerName(),
                a.getDepartment(),
                a.getLocation(),
                a.getSerialNumber(),
                a.getPurchaseDate(),
                a.getWarrantyExpiry(),
                a.getDescription(),
                a.getAssociatedService()
        );
    }
}
