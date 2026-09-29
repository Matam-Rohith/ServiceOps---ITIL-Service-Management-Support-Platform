package com.serviceops.entity;

import jakarta.persistence.*;
import java.time.Instant;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "problems", indexes = {
    @Index(name = "idx_problems_number", columnList = "problem_number", unique = true),
    @Index(name = "idx_problems_status", columnList = "status")
})
public class Problem {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "problem_number", nullable = false, unique = true, length = 32)
    private String problemNumber;

    @Column(nullable = false, length = 200)
    private String title;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false, length = 50)
    private String category;

    @Column(name = "assigned_team", nullable = false, length = 100)
    private String assignedTeam;

    @Column(name = "assigned_agent_name", length = 100)
    private String assignedAgentName;

    @Column(name = "root_cause", columnDefinition = "TEXT")
    private String rootCause;

    @Column(columnDefinition = "TEXT")
    private String workaround;

    @Column(name = "is_known_error", nullable = false)
    private boolean isKnownError = false;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private ProblemStatus status;

    @ElementCollection
    @CollectionTable(name = "problem_incidents", joinColumns = @JoinColumn(name = "problem_id"))
    @Column(name = "incident_id")
    private List<String> relatedIncidentIds = new ArrayList<>();

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    @Column(name = "updated_at", nullable = false)
    private Instant updatedAt = Instant.now();

    @Column(name = "resolved_at")
    private Instant resolvedAt;

    public Problem() {}

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getProblemNumber() { return problemNumber; }
    public void setProblemNumber(String problemNumber) { this.problemNumber = problemNumber; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public String getAssignedTeam() { return assignedTeam; }
    public void setAssignedTeam(String assignedTeam) { this.assignedTeam = assignedTeam; }
    public String getAssignedAgentName() { return assignedAgentName; }
    public void setAssignedAgentName(String assignedAgentName) { this.assignedAgentName = assignedAgentName; }
    public String getRootCause() { return rootCause; }
    public void setRootCause(String rootCause) { this.rootCause = rootCause; }
    public String getWorkaround() { return workaround; }
    public void setWorkaround(String workaround) { this.workaround = workaround; }
    public boolean isKnownError() { return isKnownError; }
    public void setKnownError(boolean knownError) { isKnownError = knownError; }
    public ProblemStatus getStatus() { return status; }
    public void setStatus(ProblemStatus status) { this.status = status; }
    public List<String> getRelatedIncidentIds() { return relatedIncidentIds; }
    public void setRelatedIncidentIds(List<String> relatedIncidentIds) { this.relatedIncidentIds = relatedIncidentIds; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
    public Instant getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(Instant updatedAt) { this.updatedAt = updatedAt; }
    public Instant getResolvedAt() { return resolvedAt; }
    public void setResolvedAt(Instant resolvedAt) { this.resolvedAt = resolvedAt; }
}
