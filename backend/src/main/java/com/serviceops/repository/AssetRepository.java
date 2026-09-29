package com.serviceops.repository;

import com.serviceops.entity.Asset;
import com.serviceops.entity.AssetType;
import com.serviceops.entity.AssetStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssetRepository extends JpaRepository<Asset, String> {
    Optional<Asset> findByAssetTag(String assetTag);
    Optional<Asset> findBySerialNumber(String serialNumber);
    List<Asset> findByType(AssetType type);
    List<Asset> findByStatus(AssetStatus status);
}
