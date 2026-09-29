package com.serviceops.service;

import com.serviceops.dto.IncidentCreateRequest;
import com.serviceops.dto.IncidentResponse;
import com.serviceops.entity.*;
import com.serviceops.exception.BadRequestException;
import com.serviceops.mapper.IncidentMapper;
import com.serviceops.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class IncidentServiceTest {

    @Mock
    private IncidentRepository incidentRepository;
    @Mock
    private UserRepository userRepository;
    @Mock
    private AssetRepository assetRepository;
    @Mock
    private IncidentCommentRepository commentRepository;
    @Mock
    private IncidentHistoryRepository historyRepository;
    @Mock
    private AuditLogRepository auditLogRepository;
    @Mock
    private PriorityCalculationService priorityCalculationService;
    @Mock
    private SlaCalculationService slaCalculationService;
    @Mock
    private IncidentMapper incidentMapper;

    @InjectMocks
    private IncidentService incidentService;

    private User employeeUser;
    private User agentUser;

    @BeforeEach
    void setUp() {
        employeeUser = new User("usr-emp", "Sarah Chen", "employee@serviceops.local", "hashed", Role.EMPLOYEE, "Design", null);
        agentUser = new User("usr-agent", "Marcus Vance", "agent@serviceops.local", "hashed", Role.SERVICE_AGENT, "IT Support", "L2");
    }

    @Test
    @DisplayName("Create incident computes priority, sets SLA, and records audit history")
    void testCreateIncident() {
        IncidentCreateRequest req = new IncidentCreateRequest(
                "Cannot access VPN gateway",
                "Connection timeout after 30 seconds",
                "NETWORK",
                "VPN",
                Impact.HIGH,
                Urgency.HIGH,
                "PORTAL",
                "Desktop Support L2",
                null,
                null,
                "VPN Access"
        );

        when(userRepository.findByEmail("employee@serviceops.local")).thenReturn(Optional.of(employeeUser));
        when(priorityCalculationService.calculatePriority(Impact.HIGH, Urgency.HIGH)).thenReturn(Priority.P1);
        when(slaCalculationService.getPolicyForPriority(Priority.P1))
                .thenReturn(new SlaPolicy(Priority.P1, "P1 Critical", 15, 240, false, true));
        when(slaCalculationService.calculateResponseDeadline(any(), eq(Priority.P1)))
                .thenReturn(Instant.now().plusSeconds(900));
        when(slaCalculationService.calculateResolutionDeadline(any(), eq(Priority.P1)))
                .thenReturn(Instant.now().plusSeconds(14400));
        when(incidentRepository.count()).thenReturn(10L);
        when(incidentRepository.save(any(Incident.class))).thenAnswer(invocation -> invocation.getArgument(0));

        incidentService.createIncident(req, "employee@serviceops.local");

        verify(incidentRepository, times(1)).save(any(Incident.class));
        verify(historyRepository, times(1)).save(any(IncidentHistory.class));
        verify(auditLogRepository, times(1)).save(any(AuditLog.class));
    }

    @Test
    @DisplayName("Resolving an incident requires mandatory resolution notes")
    void testResolveIncidentValidation() {
        Incident inc = new Incident();
        inc.setId("inc-1");
        inc.setStatus(IncidentStatus.IN_PROGRESS);

        when(incidentRepository.findById("inc-1")).thenReturn(Optional.of(inc));

        // Missing resolution notes should throw BadRequestException
        assertThrows(BadRequestException.class, () ->
                incidentService.updateStatus("inc-1", IncidentStatus.RESOLVED, "", "Marcus Vance"));
    }

    @Test
    @DisplayName("Employee role cannot author internal work notes")
    void testEmployeeCannotAuthorInternalWorkNotes() {
        Incident inc = new Incident();
        inc.setId("inc-1");
        when(incidentRepository.findById("inc-1")).thenReturn(Optional.of(inc));
        when(userRepository.findByEmail("employee@serviceops.local")).thenReturn(Optional.of(employeeUser));

        assertThrows(BadRequestException.class, () ->
                incidentService.addComment("inc-1", "Internal technical notes", true, "employee@serviceops.local"));
    }
}
