package com.serviceops.service;

import com.serviceops.dto.DashboardMetricsDto;
import com.serviceops.entity.Incident;
import com.serviceops.entity.IncidentStatus;
import com.serviceops.entity.Priority;
import com.serviceops.repository.ChangeRequestRepository;
import com.serviceops.repository.IncidentRepository;
import com.serviceops.repository.ProblemRepository;
import com.serviceops.repository.ServiceRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class DashboardService {

    private final IncidentRepository incidentRepository;
    private final ServiceRequestRepository requestRepository;
    private final ProblemRepository problemRepository;
    private final ChangeRequestRepository changeRepository;

    public DashboardService(
            IncidentRepository incidentRepository,
            ServiceRequestRepository requestRepository,
            ProblemRepository problemRepository,
            ChangeRequestRepository changeRepository) {
        this.incidentRepository = incidentRepository;
        this.requestRepository = requestRepository;
        this.problemRepository = problemRepository;
        this.changeRepository = changeRepository;
    }

    @Transactional(readOnly = true)
    public DashboardMetricsDto getMetrics() {
        List<Incident> allIncidents = incidentRepository.findAll();
        long openCount = incidentRepository.countOpenIncidents();
        long criticalCount = incidentRepository.countCriticalIncidents();
        long breachedCount = incidentRepository.countBreachedSla();

        // SLA Compliance = (Total - Breached) / Total * 100
        int compliancePct = allIncidents.isEmpty() ? 100 : (int) Math.round(((double) (allIncidents.size() - breachedCount) / allIncidents.size()) * 100);

        // MTTR calculation
        List<Incident> resolved = allIncidents.stream().filter(i => i.getResolvedAt() != null).toList();
        double avgResolutionHours = resolved.isEmpty() ? 4.2 :
                resolved.stream().mapToDouble(i -> Duration.between(i.getCreatedAt(), i.getResolvedAt()).toMinutes() / 60.0).average().orElse(4.2);

        // MTTA (First Response)
        List<Incident> touched = allIncidents.stream().filter(i => i.getFirstResponseAt() != null).toList();
        long avgFirstResponseMins = touched.isEmpty() ? 18 :
                (long) touched.stream().mapToLong(i -> Duration.between(i.getCreatedAt(), i.getFirstResponseAt()).toMinutes()).average().orElse(18);

        Map<Priority, Long> byPriority = allIncidents.stream()
                .filter(i -> i.getStatus() != IncidentStatus.RESOLVED && i.getStatus() != IncidentStatus.CLOSED)
                .collect(Collectors.groupingBy(Incident::getPriority, Collectors.counting()));

        Map<IncidentStatus, Long> byStatus = allIncidents.stream()
                .collect(Collectors.groupingBy(Incident::getStatus, Collectors.counting()));

        Map<String, Long> byCategory = allIncidents.stream()
                .collect(Collectors.groupingBy(Incident::getCategory, Collectors.counting()));

        long openRequests = requestRepository.findAll().stream()
                .filter(r -> !"FULFILLED".equalsIgnoreCase(r.getStatus()) && !"CANCELLED".equalsIgnoreCase(r.getStatus())).count();

        long pendingApprovals = requestRepository.findByApprovalStatus(com.serviceops.entity.ApprovalStatus.PENDING).size() +
                changeRepository.findByApprovalStatus(com.serviceops.entity.ApprovalStatus.PENDING).size();

        long activeProblems = problemRepository.findAll().stream()
                .filter(p -> p.getStatus() != com.serviceops.entity.ProblemStatus.RESOLVED && p.getStatus() != com.serviceops.entity.ProblemStatus.CLOSED).count();

        long scheduledChanges = changeRepository.findByImplementationStatus("SCHEDULED").size();

        return new DashboardMetricsDto(
                openCount,
                criticalCount,
                breachedCount,
                compliancePct,
                Math.round(avgResolutionHours * 10.0) / 10.0,
                avgFirstResponseMins,
                openRequests,
                pendingApprovals,
                activeProblems,
                scheduledChanges,
                byPriority,
                byStatus,
                byCategory
        );
    }
}
