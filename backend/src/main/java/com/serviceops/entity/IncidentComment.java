package com.serviceops.entity;

import jakarta.persistence.*;
import java.time.Instant;

@Entity
@Table(name = "incident_comments")
public class IncidentComment {

    @Id
    @Column(length = 36, nullable = false)
    private String id;

    @Column(name = "incident_id", nullable = false, length = 36)
    private String incidentId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "author_id", nullable = false)
    private User author;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    @Column(name = "is_internal_work_note", nullable = false)
    private boolean isInternalWorkNote;

    @Column(name = "created_at", nullable = false, updatable = false)
    private Instant createdAt = Instant.now();

    public IncidentComment() {}

    public IncidentComment(String id, String incidentId, User author, String content, boolean isInternalWorkNote) {
        this.id = id;
        this.incidentId = incidentId;
        this.author = author;
        this.content = content;
        this.isInternalWorkNote = isInternalWorkNote;
        this.createdAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getIncidentId() { return incidentId; }
    public void setIncidentId(String incidentId) { this.incidentId = incidentId; }
    public User getAuthor() { return author; }
    public void setAuthor(User author) { this.author = author; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public boolean isInternalWorkNote() { return isInternalWorkNote; }
    public void setInternalWorkNote(boolean internalWorkNote) { isInternalWorkNote = internalWorkNote; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
