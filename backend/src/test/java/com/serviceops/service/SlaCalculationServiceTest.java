package com.serviceops.service;

import com.serviceops.entity.*;
import com.serviceops.repository.IncidentRepository;
import com.serviceops.repository.SlaPolicyRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class SlaCalculationServiceTest {

    @Mock
    private SlaPolicyRepository slaPolicyRepository;

    @Mock
    private IncidentRepository incidentRepository;

    private SlaCalculationService service;

    @BeforeEach
    void setUp() {
        service = new SlaCalculationService(slaPolicyRepository, incidentRepository);
    }

    @Test
    @DisplayName("Calculate response and resolution deadlines from policy")
    void testCalculateDeadlines() {
        SlaPolicy p1Policy = new SlaPolicy(Priority.P1, "P1 SLA", 15, 240, false, true);
        when(slaPolicyRepository.findByPriority(Priority.P1)).thenReturn(Optional.of(p1Policy));

        Instant startTime = Instant.parse("2026-10-01T10:00:00Z");

        Instant responseDeadline = service.calculateResponseDeadline(startTime, Priority.P1);
        Instant resolutionDeadline = service.calculateResolutionDeadline(startTime, Priority.P1);

        assertEquals(startTime.plus(Duration.ofMinutes(15)), responseDeadline);
        assertEquals(startTime.plus(Duration.ofMinutes(240)), resolutionDeadline);
    }

    @Test
    @DisplayName("Authoritative SLA engine detects overdue resolution deadline and flags BREACHED")
    void testBreachDetection() {
        Instant pastCreation = Instant.now().minus(Duration.ofHours(5));
        Instant overdueResolution = Instant.now().minus(Duration.ofHours(1));
        Instant pastResponse = Instant.now().minus(Duration.ofHours(4));

        Incident overdueIncident = new Incident();
        overdueIncident.setId("inc-test");
        overdueIncident.setIncidentNumber("INC-9999");
        overdueIncident.setCreatedAt(pastCreation);
        overdueIncident.setResponseDeadline(pastResponse);
        overdueIncident.setResolutionDeadline(overdueResolution);
        overdueIncident.setFirstResponseAt(pastResponse.minus(Duration.ofMinutes(5)));
        overdueIncident.setStatus(IncidentStatus.IN_PROGRESS);
        overdueIncident.setSlaStatus(SlaStatus.ON_TRACK);

        when(incidentRepository.findActiveIncidents()).thenReturn(List.of(overdueIncident));

        service.evaluateActiveIncidentSlas();

        assertTrue(overdueIncident.isResolutionBreached());
        assertEquals(SlaStatus.BREACHED, overdueIncident.getSlaStatus());
        verify(incidentRepository, times(1)).save(overdueIncident);
    }

    @Test
    @DisplayName("SLA status transitions to PAUSED when incident is placed on PENDING")
    void testSlaPausedOnPending() {
        Instant now = Instant.now();
        Incident pendingIncident = new Incident();
        pendingIncident.setId("inc-pending");
        pendingIncident.setIncidentNumber("INC-8888");
        pendingIncident.setCreatedAt(now.minus(Duration.ofHours(1)));
        pendingIncident.setResponseDeadline(now.plus(Duration.ofHours(1)));
        pendingIncident.setResolutionDeadline(now.plus(Duration.ofHours(7)));
        pendingIncident.setFirstResponseAt(now.minus(Duration.ofMinutes(50)));
        pendingIncident.setStatus(IncidentStatus.PENDING);
        pendingIncident.setSlaStatus(SlaStatus.ON_TRACK);

        when(incidentRepository.findActiveIncidents()).thenReturn(List.of(pendingIncident));

        service.evaluateActiveIncidentSlas();

        assertEquals(SlaStatus.PAUSED, pendingIncident.getSlaStatus());
        verify(incidentRepository, times(1)).save(pendingIncident);
    }
}
