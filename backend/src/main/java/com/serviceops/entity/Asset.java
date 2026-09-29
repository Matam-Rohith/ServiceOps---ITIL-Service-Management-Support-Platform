package com.serviceops.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "cmdb_assets", indexes = {
    @Index(name = "idx_assets_tag", columnList = "asset_tag", unique = true),
    @Index(name = "idx_assets_type", columnList = "type"),
    @Index(name = "idx_assets_status", columnList = "status"),
    @Index(name = "idx_assets_serial", columnList = "serial_number")
})
public class Asset {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "asset_tag", nullable = false, unique = true, length = 32)
    private String assetTag;

    @Column(nullable = false, length = 150)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AssetType type;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private AssetStatus status;

    @Column(name = "owner_name", length = 100)
    private String ownerName;

    @Column(nullable = false, length = 100)
    private String department;

    @Column(nullable = false, length = 150)
    private String location;

    @Column(name = "serial_number", nullable = false, length = 100)
    private String serialNumber;

    @Column(name = "purchase_date", length = 30)
    private String purchaseDate;

    @Column(name = "warranty_expiry", length = 30)
    private String warrantyExpiry;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "associated_service", length = 100)
    private String associatedService;

    public Asset() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getAssetTag() { return assetTag; }
    public void setAssetTag(String assetTag) { this.assetTag = assetTag; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public AssetType getType() { return type; }
    public void setType(AssetType type) { this.type = type; }
    public AssetStatus getStatus() { return status; }
    public void setStatus(AssetStatus status) { this.status = status; }
    public String getOwnerName() { return ownerName; }
    public void setOwnerName(String ownerName) { this.ownerName = ownerName; }
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    public String getLocation() { return location; }
    public void setLocation(String location) { this.location = location; }
    public String getSerialNumber() { return serialNumber; }
    public void setSerialNumber(String serialNumber) { this.serialNumber = serialNumber; }
    public String getPurchaseDate() { return purchaseDate; }
    public void setPurchaseDate(String purchaseDate) { this.purchaseDate = purchaseDate; }
    public String getWarrantyExpiry() { return warrantyExpiry; }
    public void setWarrantyExpiry(String warrantyExpiry) { this.warrantyExpiry = warrantyExpiry; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getAssociatedService() { return associatedService; }
    public void setAssociatedService(String associatedService) { this.associatedService = associatedService; }
}
