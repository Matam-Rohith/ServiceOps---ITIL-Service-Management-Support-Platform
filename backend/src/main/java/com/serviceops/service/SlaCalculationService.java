package com.serviceops.service;

import com.serviceops.entity.*;
import com.serviceops.repository.IncidentRepository;
import com.serviceops.repository.SlaPolicyRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.List;

@Service
public class SlaCalculationService {

    private static final Logger log = LoggerFactory.getLogger(SlaCalculationService.class);

    private final SlaPolicyRepository slaPolicyRepository;
    private final IncidentRepository incidentRepository;

    public SlaCalculationService(SlaPolicyRepository slaPolicyRepository, IncidentRepository incidentRepository) {
        this.slaPolicyRepository = slaPolicyRepository;
        this.incidentRepository = incidentRepository;
    }

    public SlaPolicy getPolicyForPriority(Priority priority) {
        return slaPolicyRepository.findByPriority(priority)
                .orElse(new SlaPolicy(priority, priority.name() + " Default SLA", 60, 1440, false, true));
    }

    public Instant calculateResponseDeadline(Instant startTime, Priority priority) {
        SlaPolicy policy = getPolicyForPriority(priority);
        return startTime.plus(Duration.ofMinutes(policy.getResponseTargetMinutes()));
    }

    public Instant calculateResolutionDeadline(Instant startTime, Priority priority) {
        SlaPolicy policy = getPolicyForPriority(priority);
        return startTime.plus(Duration.ofMinutes(policy.getResolutionTargetMinutes()));
    }

    /**
     * Authoritative Background SLA Evaluator
     * Ticks every 10 seconds to detect breaches and update SLA status flags
     */
    @Scheduled(fixedRateString = "${serviceops.sla.calculation-rate-ms:10000}")
    @Transactional
    public void evaluateActiveIncidentSlas() {
        List<Incident> activeIncidents = incidentRepository.findActiveIncidents();
        Instant now = Instant.now();

        for (Incident inc : activeIncidents) {
            boolean updated = false;

            // 1. Response SLA evaluation
            if (inc.getFirstResponseAt() == null && now.isAfter(inc.getResponseDeadline())) {
                if (!inc.isResponseBreached()) {
                    inc.setResponseBreached(true);
                    inc.setSlaStatus(SlaStatus.BREACHED);
                    updated = true;
                    log.warn("SLA RESPONSE BREACH: Incident {} exceeded response target deadline of {}",
                            inc.getIncidentNumber(), inc.getResponseDeadline());
                }
            }

            // 2. Resolution SLA evaluation
            if (now.isAfter(inc.getResolutionDeadline())) {
                if (!inc.isResolutionBreached()) {
                    inc.setResolutionBreached(true);
                    inc.setSlaStatus(SlaStatus.BREACHED);
                    updated = true;
                    log.warn("SLA RESOLUTION BREACH: Incident {} breached resolution deadline of {}",
                            inc.getIncidentNumber(), inc.getResolutionDeadline());
                }
            } else if (inc.getStatus() == IncidentStatus.PENDING) {
                if (inc.getSlaStatus() != SlaStatus.PAUSED) {
                    inc.setSlaStatus(SlaStatus.PAUSED);
                    updated = true;
                }
            } else {
                // Check if AT_RISK (< 25% remaining time window)
                long totalWindow = Duration.between(inc.getCreatedAt(), inc.getResolutionDeadline()).toMillis();
                long remaining = Duration.between(now, inc.getResolutionDeadline()).toMillis();
                if (remaining > 0 && remaining < (totalWindow * 0.25)) {
                    if (inc.getSlaStatus() != SlaStatus.AT_RISK && !inc.isResolutionBreached()) {
                        inc.setSlaStatus(SlaStatus.AT_RISK);
                        updated = true;
                    }
                }
            }

            if (updated) {
                inc.setUpdatedAt(now);
                incidentRepository.save(inc);
            }
        }
    }
}
