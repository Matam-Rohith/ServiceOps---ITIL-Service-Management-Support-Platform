package com.serviceops.repository;

import com.serviceops.entity.Incident;
import com.serviceops.entity.IncidentStatus;
import com.serviceops.entity.Priority;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface IncidentRepository extends JpaRepository<Incident, String> {
    Optional<Incident> findByIncidentNumber(String incidentNumber);
    List<Incident> findByRequesterId(String requesterId);
    List<Incident> findByAssignedAgentId(String assignedAgentId);
    List<Incident> findByStatus(IncidentStatus status);
    List<Incident> findByPriority(Priority priority);
    
    // SLA monitoring query for open incidents
    @Query("SELECT i FROM Incident i WHERE i.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    List<Incident> findActiveIncidents();

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    long countOpenIncidents();

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.priority = 'P1' AND i.status NOT IN ('RESOLVED', 'CLOSED', 'CANCELLED')")
    long countCriticalIncidents();

    @Query("SELECT COUNT(i) FROM Incident i WHERE i.resolutionBreached = true OR i.responseBreached = true")
    long countBreachedSla();
}
