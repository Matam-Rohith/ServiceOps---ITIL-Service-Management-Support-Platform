package com.serviceops.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "incident_history")
public class IncidentHistory {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "incident_id", nullable = false, length = 36)
    private String incidentId;

    @Column(name = "actor_name", nullable = false, length = 100)
    private String actorName;

    @Column(nullable = false, length = 150)
    private String action;

    @Column(name = "field_name", length = 50)
    private String fieldName;

    @Column(name = "old_value", columnDefinition = "TEXT")
    private String oldValue;

    @Column(name = "new_value", columnDefinition = "TEXT")
    private String newValue;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public IncidentHistory() {}

    public IncidentHistory(String id, String incidentId, String actorName, String action, String fieldName, String oldValue, String newValue) {
        this.id = id;
        this.incidentId = incidentId;
        this.actorName = actorName;
        this.action = action;
        this.fieldName = fieldName;
        this.oldValue = oldValue;
        this.newValue = newValue;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }
    public String getActorName() { return actorName; }
    public void setActorName(String actorName) { this.actorName = actorName; }
    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }
    public String getFieldName() { return fieldName; }
    public void setFieldName(String fieldName) { this.fieldName = fieldName; }
    public String getOldValue() { return oldValue; }
    public void setOldValue(String oldValue) { this.oldValue = oldValue; }
    public String getNewValue() { return newValue; }
    public void setNewValue(String newValue) { this.newValue = newValue; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
