package com.serviceops.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "change_requests", indexes = {
    @Index(name = "idx_changes_number", columnList = "change_number", unique = true),
    @Index(name = "idx_changes_type", columnList = "change_type"),
    @Index(name = "idx_changes_status", columnList = "implementation_status")
})
public class ChangeRequest {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "change_number", nullable = false, unique = true, length = 32)
    private String changeNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(columnDefinition = "TEXT")
    private String reason;

    @Enumerated(EnumType.STRING)
    @Column(name = "change_type", nullable = false, length = 20)
    private ChangeType changeType;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private ChangeRisk risk;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Impact impact;

    @Column(name = "affected_service", nullable = false, length = 100)
    private String affectedService;

    @Column(name = "implementation_plan", nullable = false, columnDefinition = "TEXT")
    private String implementationPlan;

    @Column(name = "rollback_plan", nullable = false, columnDefinition = "TEXT")
    private String rollbackPlan;

    @Column(name = "test_plan", nullable = false, columnDefinition = "TEXT")
    private String testPlan;

    @Column(name = "requester_name", nullable = false, length = 100)
    private String requesterName;

    @Column(name = "assigned_owner_name", nullable = false, length = 100)
    private String assignedOwnerName;

    @Enumerated(EnumType.STRING)
    @Column(name = "approval_status", nullable = false, length = 20)
    private ApprovalStatus approvalStatus;

    @Column(name = "approver_name", length = 100)
    private String approverName;

    @Column(name = "approval_comments", columnDefinition = "TEXT")
    private String approvalComments;

    @Column(name = "implementation_status", nullable = false, length = 32)
    private String implementationStatus; // DRAFT, SCHEDULED, IN_PROGRESS, COMPLETED, FAILED, ROLLED_BACK

    @Column(name = "scheduled_start", nullable = false)
    private Instant scheduledStart;

    @Column(name = "scheduled_end", nullable = false)
    private Instant scheduledEnd;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    public ChangeRequest() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getChangeNumber() { return changeNumber; }
    public void setChangeNumber(String changeNumber) { this.changeNumber = changeNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    public ChangeType getChangeType() { return changeType; }
    public void setChangeType(ChangeType changeType) { this.changeType = changeType; }
    public ChangeRisk getRisk() { return risk; }
    public void setRisk(ChangeRisk risk) { this.risk = risk; }
    public Impact getImpact() { return impact; }
    public void setImpact(Impact impact) { this.impact = impact; }
    public String getAffectedService() { return affectedService; }
    public void setAffectedService(String affectedService) { this.affectedService = affectedService; }
    public String getImplementationPlan() { return implementationPlan; }
    public void setImplementationPlan(String implementationPlan) { this.implementationPlan = implementationPlan; }
    public String getRollbackPlan() { return rollbackPlan; }
    public void setRollbackPlan(String rollbackPlan) { this.rollbackPlan = rollbackPlan; }
    public String getTestPlan() { return testPlan; }
    public void setTestPlan(String testPlan) { this.testPlan = testPlan; }
    public String getRequesterName() { return requesterName; }
    public void setRequesterName(String requesterName) { this.requesterName = requesterName; }
    public String getAssignedOwnerName() { return assignedOwnerName; }
    public void setAssignedOwnerName(String assignedOwnerName) { this.assignedOwnerName = assignedOwnerName; }
    public ApprovalStatus getApprovalStatus() { return approvalStatus; }
    public void setApprovalStatus(ApprovalStatus approvalStatus) { this.approvalStatus = approvalStatus; }
    public String getApproverName() { return approverName; }
    public void setApproverName(String approverName) { this.approverName = approverName; }
    public String getApprovalComments() { return approvalComments; }
    public void setApprovalComments(String approvalComments) { this.approvalComments = approvalComments; }
    public String getImplementationStatus() { return implementationStatus; }
    public void setImplementationStatus(String implementationStatus) { this.implementationStatus = implementationStatus; }
    public Instant getScheduledStart() { return scheduledStart; }
    public void setScheduledStart(Instant scheduledStart) { this.scheduledStart = scheduledStart; }
    public Instant getScheduledEnd() { return scheduledEnd; }
    public void setScheduledEnd(Instant scheduledEnd) { this.scheduledEnd = scheduledEnd; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
}
