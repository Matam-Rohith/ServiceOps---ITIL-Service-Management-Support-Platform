package com.serviceops.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "service_catalog_items")
public class ServiceCatalogItem {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 50)
    private String icon;

    @Column(name = "approval_required", nullable = false)
    private boolean approvalRequired;

    @Column(name = "default_assignment_group", nullable = false, length = 100)
    private String defaultAssignmentGroup;

    @Column(name = "expected_fulfillment_hours", nullable = false)
    private int expectedFulfillmentHours;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "form_fields_json", columnDefinition = "TEXT")
    private String formFieldsJson;

    public ServiceCatalogItem() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getIcon() { return icon; }
    public void setIcon(String icon) { this.icon = icon; }
    public boolean isApprovalRequired() { return approvalRequired; }
    public void setApprovalRequired(boolean approvalRequired) { this.approvalRequired = approvalRequired; }
    public String getDefaultAssignmentGroup() { return defaultAssignmentGroup; }
    public void setDefaultAssignmentGroup(String defaultAssignmentGroup) { this.defaultAssignmentGroup = defaultAssignmentGroup; }
    public int getExpectedFulfillmentHours() { return expectedFulfillmentHours; }
    public void setExpectedFulfillmentHours(int expectedFulfillmentHours) { this.expectedFulfillmentHours = expectedFulfillmentHours; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
    public String getFormFieldsJson() { return formFieldsJson; }
    public void setFormFieldsJson(String formFieldsJson) { this.formFieldsJson = formFieldsJson; }
}
