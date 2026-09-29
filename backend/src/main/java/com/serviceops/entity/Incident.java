package com.serviceops.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "incidents", indexes = {
    @Index(name = "idx_incidents_number", columnList = "incident_number", unique = true),
    @Index(name = "idx_incidents_status", columnList = "status"),
    @Index(name = "idx_incidents_priority", columnList = "priority"),
    @Index(name = "idx_incidents_assigned", columnList = "assigned_agent_id"),
    @Index(name = "idx_incidents_requester", columnList = "requester_id")
})
public class Incident {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Version
    private Long version; // Optimistic locking mechanism for interview defensibility

    @Column(name = "incident_number", nullable = false, unique = true, length = 32)
    private String incidentNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "requester_id", nullable = false)
    private User requester;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assigned_agent_id")
    private User assignedAgent;

    @Column(name = "assignment_group", nullable = false, length = 100)
    private String assignmentGroup;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(length = 50)
    private String subcategory;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Impact impact;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 10)
    private Urgency urgency;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 4)
    private Priority priority;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private IncidentStatus status;

    @Column(nullable = false, length = 20)
    private String source; // PORTAL, EMAIL, PHONE, MONITORING

    @Column(name = "affected_asset_id", length = 36)
    private String affectedAssetId;

    @Column(name = "affected_service", length = 100)
    private String affectedService;

    @Column(name = "related_problem_id", length = 36)
    private String relatedProblemId;

    @Column(name = "resolution_notes", columnDefinition = "TEXT")
    private String resolutionNotes;

    @Column(name = "pending_reason", columnDefinition = "TEXT")
    private String pendingReason;

    // SLA Tracking Fields
    @Column(name = "sla_policy_name", length = 100)
    private String slaPolicyName;

    @Column(name = "response_deadline", nullable = false)
    private Instant responseDeadline;

    @Column(name = "resolution_deadline", nullable = false)
    private Instant resolutionDeadline;

    @Column(name = "response_breached", nullable = false)
    private boolean responseBreached = false;

    @Column(name = "resolution_breached", nullable = false)
    private boolean resolutionBreached = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "sla_status", nullable = false, length = 20)
    private SlaStatus slaStatus = SlaStatus.ON_TRACK;

    // Milestones
    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(name = "first_response_at")
    private Instant firstResponseAt;

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    @Column(name = "closed_at")
    private Instant closedAt;

    public Incident() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public Long getVersion() { return version; }
    public void setVersion(Long version) { this.version = version; }
    public String getIncidentNumber() { return incidentNumber; }
    public void setIncidentNumber(String incidentNumber) { this.incidentNumber = incidentNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public User getRequester() { return requester; }
    public void setRequester(User requester) { this.requester = requester; }
    public User getAssignedAgent() { return assignedAgent; }
    public void setAssignedAgent(User assignedAgent) { this.assignedAgent = assignedAgent; }
    public String getAssignmentGroup() { return assignmentGroup; }
    public void setAssignmentGroup(String assignmentGroup) { this.assignmentGroup = assignmentGroup; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getSubcategory() { return subcategory; }
    public void setSubcategory(String subcategory) { this.subcategory = subcategory; }
    public Impact getImpact() { return impact; }
    public void setImpact(Impact impact) { this.impact = impact; }
    public Urgency getUrgency() { return urgency; }
    public void setUrgency(Urgency urgency) { this.urgency = urgency; }
    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public IncidentStatus getStatus() { return status; }
    public void setStatus(IncidentStatus status) { this.status = status; }
    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
    public String getAffectedAssetId() { return affectedAssetId; }
    public void setAffectedAssetId(String affectedAssetId) { this.affectedAssetId = affectedAssetId; }
    public String getAffectedService() { return affectedService; }
    public void setAffectedService(String affectedService) { this.affectedService = affectedService; }
    public String getRelatedProblemId() { return relatedProblemId; }
    public void setRelatedProblemId(String relatedProblemId) { this.relatedProblemId = relatedProblemId; }
    public String getResolutionNotes() { return resolutionNotes; }
    public void setResolutionNotes(String resolutionNotes) { this.resolutionNotes = resolutionNotes; }
    public String getPendingReason() { return pendingReason; }
    public void setPendingReason(String pendingReason) { this.pendingReason = pendingReason; }
    public String getSlaPolicyName() { return slaPolicyName; }
    public void setSlaPolicyName(String slaPolicyName) { this.slaPolicyName = slaPolicyName; }
    public Instant getResponseDeadline() { return responseDeadline; }
    public void setResponseDeadline(Instant responseDeadline) { this.responseDeadline = responseDeadline; }
    public Instant getResolutionDeadline() { return resolutionDeadline; }
    public void setResolutionDeadline(Instant resolutionDeadline) { this.resolutionDeadline = resolutionDeadline; }
    public boolean isResponseBreached() { return responseBreached; }
    public void setResponseBreached(boolean responseBreached) { this.responseBreached = responseBreached; }
    public boolean isResolutionBreached() { return resolutionBreached; }
    public void setResolutionBreached(boolean resolutionBreached) { this.resolutionBreached = resolutionBreached; }
    public SlaStatus getSlaStatus() { return slaStatus; }
    public void setSlaStatus(SlaStatus slaStatus) { this.slaStatus = slaStatus; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getFirstResponseAt() { return firstResponseAt; }
    public void setFirstResponseAt(Instant firstResponseAt) { this.firstResponseAt = firstResponseAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
    public Instant getClosedAt() { return closedAt; }
    public void setClosedAt(Instant closedAt) { this.closedAt = closedAt; }
}
