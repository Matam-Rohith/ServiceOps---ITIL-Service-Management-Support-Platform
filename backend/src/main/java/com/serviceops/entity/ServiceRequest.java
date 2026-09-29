package com.serviceops.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "service_requests", indexes = {
    @Index(name = "idx_requests_number", columnList = "request_number", unique = true),
    @Index(name = "idx_requests_requester", columnList = "requester_id"),
    @Index(name = "idx_requests_status", columnList = "status"),
    @Index(name = "idx_requests_approval", columnList = "approval_status")
})
public class ServiceRequest {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "request_number", nullable = false, unique = true, length = 32)
    private String requestNumber;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "catalog_item_id", nullable = false)
    private ServiceCatalogItem catalogItem;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    @Column(name = "assignment_group", nullable = false, length = 100)
    private String assignmentGroup;

    @Column(nullable = false, length = 32)
    private String status; // PENDING_APPROVAL, APPROVED, IN_PROGRESS, FULFILLED, REJECTED, CANCELLED

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    private ApprovalStatus approvalStatus;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approver_id")
    private User approver;

    @Column(name = "approval_decision_at")
    private Instant approvalDecisionAt;

    @Column(name = "approval_comments", columnDefinition = "TEXT")
    private String approvalComments;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String justification;

    @Column(name = "form_data_json", columnDefinition = "TEXT")
    private String formDataJson;

    @Column(name = "expected_fulfillment_at", nullable = false)
    private Instant expectedFulfillmentAt;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    public ServiceRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getRequestNumber() { return requestNumber; }
    public void setRequestNumber(String requestNumber) { this.requestNumber = requestNumber; }
    public ServiceCatalogItem getCatalogItem() { return catalogItem; }
    public void setCatalogItem(ServiceCatalogItem catalogItem) { this.catalogItem = catalogItem; }
    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }
    public User getAssignedAgent() { return assignedAgent; }
    public void setAssignedAgent(User assignedAgent) { this.assignedAgent = assignedAgent; }
    public String getAssignmentGroup() { return assignmentGroup; }
    public void setAssignmentGroup(String assignmentGroup) { this.assignmentGroup = assignmentGroup; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ApprovalStatus approvalStatus) { this.approvalStatus = approvalStatus; }
    public User getApprover() { return approver; }
    public void setApprover(User approver) { this.approver = approver; }
    public Instant getApprovalDecisionAt() { return approvalDecisionAt; }
    public void setApprovalDecisionAt(Instant approvalDecisionAt) { this.approvalDecisionAt = approvalDecisionAt; }
    public String getApprovalComments() { return approvalComments; }
    public void setApprovalComments(String approvalComments) { this.approvalComments = approvalComments; }
    public String getJustification() { return justification; }
    public void setJustification(String justification) { this.justification = justification; }
    public String getFormDataJson() { return formDataJson; }
    public void setFormDataJson(String formDataJson) { this.formDataJson = formDataJson; }
    public Instant getExpectedFulfillmentAt() { return expectedFulfillmentAt; }
    public void setExpectedFulfillmentAt(Instant expectedFulfillmentAt) { this.expectedFulfillmentAt = expectedFulfillmentAt; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
}
