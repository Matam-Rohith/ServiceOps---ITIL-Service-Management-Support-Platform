package com.serviceops.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "sla_policies")
public class SlaPolicy {

    @Id
    @Enumerated(EnumType.STRING)
    @Column(length = 4, nullable = false)
    private Priority priority;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(name = "response_target_minutes", nullable = false)
    private int responseTargetMinutes;

    @Column(name = "resolution_target_minutes", nullable = false)
    private int resolutionTargetMinutes;

    @Column(name = "business_hours_only", nullable = false)
    private boolean businessHoursOnly;

    @Column(nullable = false)
    private boolean active = true;

    public SlaPolicy() {}

    public SlaPolicy(Priority priority, String name, int responseTargetMinutes, int resolutionTargetMinutes, boolean businessHoursOnly, boolean active) {
        this.priority = priority;
        this.name = name;
        this.responseTargetMinutes = responseTargetMinutes;
        this.resolutionTargetMinutes = resolutionTargetMinutes;
        this.businessHoursOnly = businessHoursOnly;
        this.active = active;
    }

    public Priority getPriority() { return priority; }
    public void setPriority(Priority priority) { this.priority = priority; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public int getResponseTargetMinutes() { return responseTargetMinutes; }
    public void setResponseTargetMinutes(int responseTargetMinutes) { this.responseTargetMinutes = responseTargetMinutes; }
    public int getResolutionTargetMinutes() { return resolutionTargetMinutes; }
    public void setResolutionTargetMinutes(int resolutionTargetMinutes) { this.resolutionTargetMinutes = resolutionTargetMinutes; }
    public boolean isBusinessHoursOnly() { return businessHoursOnly; }
    public void setBusinessHoursOnly(boolean businessHoursOnly) { this.businessHoursOnly = businessHoursOnly; }
    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }
}
