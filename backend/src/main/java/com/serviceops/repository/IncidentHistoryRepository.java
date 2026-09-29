package com.serviceops.repository;

import com.serviceops.entity.IncidentHistory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IncidentHistoryRepository extends JpaRepository<IncidentHistory, String> {
    List<IncidentHistory> findByIncidentIdOrderByCreatedAtDesc(String incidentId);
}
