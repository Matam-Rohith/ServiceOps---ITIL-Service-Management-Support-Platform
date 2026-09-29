package com.serviceops.service;

import com.serviceops.dto.*;
import com.serviceops.entity.*;
import com.serviceops.exception.BadRequestException;
import com.serviceops.exception.ResourceNotFoundException;
import com.serviceops.mapper.IncidentMapper;
import com.serviceops.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class IncidentService {

    private final IncidentRepository incidentRepository;
    private final UserRepository userRepository;
    private final AssetRepository assetRepository;
    private final IncidentCommentRepository commentRepository;
    private final IncidentHistoryRepository historyRepository;
    private final AuditLogRepository auditLogRepository;
    private final PriorityCalculationService priorityCalculationService;
    private final SlaCalculationService slaCalculationService;
    private final IncidentMapper incidentMapper;

    public IncidentService(
            IncidentRepository incidentRepository,
            UserRepository userRepository,
            AssetRepository assetRepository,
            IncidentCommentRepository commentRepository,
            IncidentHistoryRepository historyRepository,
            AuditLogRepository auditLogRepository,
            PriorityCalculationService priorityCalculationService,
            SlaCalculationService slaCalculationService,
            IncidentMapper incidentMapper) {
        this.incidentRepository = incidentRepository;
        this.userRepository = userRepository;
        this.assetRepository = assetRepository;
        this.commentRepository = commentRepository;
        this.historyRepository = historyRepository;
        this.auditLogRepository = auditLogRepository;
        this.priorityCalculationService = priorityCalculationService;
        this.slaCalculationService = slaCalculationService;
        this.incidentMapper = incidentMapper;
    }

    @Transactional
    public IncidentResponse createIncident(IncidentCreateRequest req, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Requester user not found: " + requesterEmail));

        Priority priority = priorityCalculationService.calculatePriority(req.impact(), req.urgency());
        SlaPolicy slaPolicy = slaCalculationService.getPolicyForPriority(priority);

        Instant now = Instant.now();
        Instant responseDeadline = slaCalculationService.calculateResponseDeadline(now, priority);
        Instant resolutionDeadline = slaCalculationService.calculateResolutionDeadline(now, priority);

        String id = UUID.randomUUID().toString();
        long nextNum = incidentRepository.count() + 1001;
        String incidentNumber = "INC-" + nextNum;

        Incident incident = new Incident();
        incident.setId(id);
        incident.setIncidentNumber(incidentNumber);
        incident.setTitle(req.title());
        incident.setDescription(req.description());
        incident.setRequester(requester);
        incident.setCategory(req.category());
        incident.setSubcategory(req.subcategory());
        incident.setImpact(req.impact());
        incident.setUrgency(req.urgency());
        incident.setPriority(priority);
        incident.setStatus(IncidentStatus.NEW);
        incident.setSource(req.source() != null ? req.source() : "PORTAL");
        incident.setAssignmentGroup(req.assignmentGroup() != null ? req.assignmentGroup() : "Service Desk L1");
        incident.setAffectedAssetId(req.affectedAssetId());
        incident.setAffectedService(req.affectedService());

        // SLA
        incident.setSlaPolicyName(slaPolicy.getName());
        incident.setResponseDeadline(responseDeadline);
        incident.setResolutionDeadline(resolutionDeadline);
        incident.setSlaStatus(SlaStatus.ON_TRACK);
        incident.setCreatedAt(now);
        incident.setUpdatedAt(now);

        // Handle initial assignment if specified
        if (req.assignedAgentId() != null && !req.assignedAgentId().isBlank()) {
            User agent = userRepository.findById(req.assignedAgentId()).orElse(null);
            if (agent != null) {
                incident.setAssignedAgent(agent);
                incident.setStatus(IncidentStatus.ASSIGNED);
            }
        }

        Incident saved = incidentRepository.save(incident);

        // Record History & Audit
        recordHistory(saved.getId(), requester.getName(), "Incident Created via Portal", "Priority", null, priority.name());
        recordAudit(requester.getId(), requester.getName(), "CREATE", "Incident", saved.getId(), null, saved.getIncidentNumber());

        String assetName = resolveAssetName(saved.getAffectedAssetId());
        return incidentMapper.toResponse(saved, assetName);
    }

    @Transactional
    public IncidentResponse updateStatus(String incidentId, IncidentStatus newStatus, String notes, String actorName) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + incidentId));

        IncidentStatus oldStatus = incident.getStatus();
        if (oldStatus == newStatus) {
            return incidentMapper.toResponse(incident, resolveAssetName(incident.getAffectedAssetId()));
        }

        Instant now = Instant.now();

        // Milestone transition logic
        if (incident.getFirstResponseAt() == null && (newStatus == IncidentStatus.ASSIGNED || newStatus == IncidentStatus.IN_PROGRESS)) {
            incident.setFirstResponseAt(now);
        }
        if (newStatus == IncidentStatus.RESOLVED) {
            if (notes == null || notes.isBlank()) {
                throw new BadRequestException("Resolution notes are mandatory when resolving an incident.");
            }
            incident.setResolvedAt(now);
            incident.setResolutionNotes(notes);
        }
        if (newStatus == IncidentStatus.CLOSED) {
            incident.setClosedAt(now);
        }
        if (newStatus == IncidentStatus.PENDING) {
            incident.setPendingReason(notes != null ? notes : "Awaiting user feedback");
            incident.setSlaStatus(SlaStatus.PAUSED);
        } else if (oldStatus == IncidentStatus.PENDING) {
            incident.setSlaStatus(SlaStatus.ON_TRACK);
        }

        incident.setStatus(newStatus);
        incident.setUpdatedAt(now);
        Incident updated = incidentRepository.save(incident);

        recordHistory(updated.getId(), actorName, "Status Transition", "Status", oldStatus.name(), newStatus.name());

        return incidentMapper.toResponse(updated, resolveAssetName(updated.getAffectedAssetId()));
    }

    @Transactional
    public IncidentResponse assignIncident(String incidentId, String agentId, String group, String actorName) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + incidentId));

        String oldAssignee = incident.getAssignedAgent() != null ? incident.getAssignedAgent().getName() : "Unassigned";

        if (agentId != null && !agentId.isBlank()) {
            User agent = userRepository.findById(agentId)
                    .orElseThrow(() -> new ResourceNotFoundException("Agent not found with ID: " + agentId));
            incident.setAssignedAgent(agent);
            if (incident.getStatus() == IncidentStatus.NEW) {
                incident.setStatus(IncidentStatus.ASSIGNED);
            }
            if (incident.getFirstResponseAt() == null) {
                incident.setFirstResponseAt(Instant.now());
            }
        } else {
            incident.setAssignedAgent(null);
        }

        if (group != null && !group.isBlank()) {
            incident.setAssignmentGroup(group);
        }

        incident.setUpdatedAt(Instant.now());
        Incident updated = incidentRepository.save(incident);

        String newAssignee = updated.getAssignedAgent() != null ? updated.getAssignedAgent().getName() : "Unassigned";
        recordHistory(updated.getId(), actorName, "Reassigned", "AssignedAgent", oldAssignee, newAssignee);

        return incidentMapper.toResponse(updated, resolveAssetName(updated.getAffectedAssetId()));
    }

    @Transactional
    public IncidentCommentResponse addComment(String incidentId, String content, boolean isInternalWorkNote, String authorEmail) {
        Incident incident = incidentRepository.findById(incidentId)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + incidentId));

        User author = userRepository.findByEmail(authorEmail)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with email: " + authorEmail));

        // Enforce that EMPLOYEE cannot post internal work notes
        if (author.getRole() == Role.EMPLOYEE && isInternalWorkNote) {
            throw new BadRequestException("Employees cannot author internal work notes.");
        }

        IncidentComment comment = new IncidentComment(
                UUID.randomUUID().toString(),
                incident.getId(),
                author,
                content,
                isInternalWorkNote
        );

        IncidentComment saved = commentRepository.save(comment);

        // Update incident timestamp
        incident.setUpdatedAt(Instant.now());
        incidentRepository.save(incident);

        return new IncidentCommentResponse(
                saved.getId(),
                saved.getIncidentId(),
                author.getId(),
                author.getName(),
                author.getRole(),
                saved.getContent(),
                saved.isInternalWorkNote(),
                saved.getCreatedAt()
        );
    }

    @Transactional(readOnly = true)
    public IncidentResponse getIncidentById(String id) {
        Incident inc = incidentRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Incident not found with ID: " + id));
        return incidentMapper.toResponse(inc, resolveAssetName(inc.getAffectedAssetId()));
    }

    @Transactional(readOnly = true)
    public List<IncidentResponse> getAllIncidents(String requesterIdOrNull, IncidentStatus statusOrNull) {
        List<Incident> list;
        if (requesterIdOrNull != null) {
            list = incidentRepository.findByRequesterId(requesterIdOrNull);
        } else if (statusOrNull != null) {
            list = incidentRepository.findByStatus(statusOrNull);
        } else {
            list = incidentRepository.findAll();
        }

        return list.stream()
                .map(inc -> incidentMapper.toResponse(inc, resolveAssetName(inc.getAffectedAssetId())))
                .toList();
    }

    private void recordHistory(String incidentId, String actorName, String action, String field, String oldVal, String newVal) {
        IncidentHistory h = new IncidentHistory(
                UUID.randomUUID().toString(),
                incidentId,
                actorName,
                action,
                field,
                oldVal,
                newVal
        );
        historyRepository.save(h);
    }

    private void recordAudit(String actorId, String actorName, String action, String entityName, String entityId, String oldVal, String newVal) {
        AuditLog log = new AuditLog(
                UUID.randomUUID().toString(),
                actorId,
                actorName,
                action,
                entityName,
                entityId,
                oldVal,
                newVal
        );
        auditLogRepository.save(log);
    }

    private String resolveAssetName(String assetId) {
        if (assetId == null || assetId.isBlank()) return null;
        return assetRepository.findById(assetId).map(Asset::getName).orElse(null);
    }
}
