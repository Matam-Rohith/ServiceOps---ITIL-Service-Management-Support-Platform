package com.serviceops.service;

import com.serviceops.dto.ApprovalDecisionRequest;
import com.serviceops.dto.ServiceRequestCreateDto;
import com.serviceops.dto.ServiceRequestResponse;
import com.serviceops.entity.*;
import com.serviceops.exception.ResourceNotFoundException;
import com.serviceops.mapper.IncidentMapper;
import com.serviceops.repository.AuditLogRepository;
import com.serviceops.repository.ServiceCatalogItemRepository;
import com.serviceops.repository.ServiceRequestRepository;
import com.serviceops.repository.UserRepository;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.Instant;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class ServiceRequestService {

    private final ServiceRequestRepository requestRepository;
    private final ServiceCatalogItemRepository catalogItemRepository;
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final ObjectMapper objectMapper;

    public ServiceRequestService(
            ServiceRequestRepository requestRepository,
            ServiceCatalogItemRepository catalogItemRepository,
            UserRepository userRepository,
            AuditLogRepository auditLogRepository,
            ObjectMapper objectMapper) {
        this.requestRepository = requestRepository;
        this.catalogItemRepository = catalogItemRepository;
        this.userRepository = userRepository;
        this.auditLogRepository = auditLogRepository;
        this.objectMapper = objectMapper;
    }

    @Transactional
    public ServiceRequestResponse createRequest(ServiceRequestCreateDto dto, String requesterEmail) {
        User requester = userRepository.findByEmail(requesterEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Requester not found: " + requesterEmail));

        ServiceCatalogItem item = catalogItemRepository.findById(dto.catalogItemId())
                .orElseThrow(() -> new ResourceNotFoundException("Catalog item not found: " + dto.catalogItemId()));

        Instant now = Instant.now();
        Instant fulfillmentDeadline = now.plus(Duration.ofHours(item.getExpectedFulfillmentHours()));

        String id = UUID.randomUUID().toString();
        long nextNum = requestRepository.count() + 5001;
        String requestNumber = "REQ-" + nextNum;

        String formDataJson = "{}";
        if (dto.formData() != null) {
            try {
                formDataJson = objectMapper.writeValueAsString(dto.formData());
            } catch (JsonProcessingException ignored) {}
        }

        boolean requiresApproval = item.isApprovalRequired();

        ServiceRequest req = new ServiceRequest();
        req.setId(id);
        req.setRequestNumber(requestNumber);
        req.setCatalogItem(item);
        req.setRequester(requester);
        req.setAssignmentGroup(item.getDefaultAssignmentGroup());
        req.setStatus(requiresApproval ? "PENDING_APPROVAL" : "APPROVED");
        req.setApprovalStatus(requiresApproval ? ApprovalStatus.PENDING : ApprovalStatus.NOT_REQUIRED);
        req.setJustification(dto.justification());
        req.setFormDataJson(formDataJson);
        req.setExpectedFulfillmentAt(fulfillmentDeadline);
        req.setCreatedAt(now);
        req.setUpdatedAt(now);

        ServiceRequest saved = requestRepository.save(req);

        // Record Audit
        AuditLog audit = new AuditLog(
                UUID.randomUUID().toString(),
                requester.getId(),
                requester.getName(),
                "SUBMIT_REQUEST",
                "ServiceRequest",
                saved.getId(),
                null,
                saved.getRequestNumber()
        );
        auditLogRepository.save(audit);

        return toResponse(saved);
    }

    @Transactional
    public ServiceRequestResponse processApproval(String requestId, ApprovalDecisionRequest decision, String approverEmail) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found: " + requestId));

        User approver = userRepository.findByEmail(approverEmail)
                .orElseThrow(() -> new ResourceNotFoundException("Approver not found: " + approverEmail));

        Instant now = Instant.now();
        req.setApprovalStatus(decision.approved() ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED);
        req.setStatus(decision.approved() ? "APPROVED" : "REJECTED");
        req.setApprover(approver);
        req.setApprovalDecisionAt(now);
        req.setApprovalComments(decision.comments());
        req.setUpdatedAt(now);

        ServiceRequest updated = requestRepository.save(req);

        AuditLog audit = new AuditLog(
                UUID.randomUUID().toString(),
                approver.getId(),
                approver.getName(),
                decision.approved() ? "APPROVE_REQUEST" : "REJECT_REQUEST",
                "ServiceRequest",
                updated.getId(),
                "PENDING",
                req.getApprovalStatus().name()
        );
        auditLogRepository.save(audit);

        return toResponse(updated);
    }

    @Transactional
    public ServiceRequestResponse updateStatus(String requestId, String newStatus) {
        ServiceRequest req = requestRepository.findById(requestId)
                .orElseThrow(() -> new ResourceNotFoundException("Service request not found: " + requestId));

        Instant now = Instant.now();
        req.setStatus(newStatus);
        req.setUpdatedAt(now);
        if ("FULFILLED".equalsIgnoreCase(newStatus)) {
            req.setResolvedAt(now);
        }

        return toResponse(requestRepository.save(req));
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getAllRequests(String requesterIdOrNull) {
        List<ServiceRequest> list = requesterIdOrNull != null
                ? requestRepository.findByRequesterId(requesterIdOrNull)
                : requestRepository.findAll();

        return list.stream().map(this::toResponse).toList();
    }

    @Transactional(readOnly = true)
    public List<ServiceRequestResponse> getPendingApprovals() {
        return requestRepository.findByApprovalStatus(ApprovalStatus.PENDING)
                .stream().map(this::toResponse).toList();
    }

    private ServiceRequestResponse toResponse(ServiceRequest r) {
        Map<String, String> formData = Collections.emptyMap();
        if (r.getFormDataJson() != null && !r.getFormDataJson().isBlank()) {
            try {
                formData = objectMapper.readValue(r.getFormDataJson(), Map.class);
            } catch (Exception ignored) {}
        }

        return new ServiceRequestResponse(
                r.getId(),
                r.getRequestNumber(),
                r.getCatalogItem().getId(),
                r.getCatalogItem().getName(),
                IncidentMapper.toUserDto(r.getRequester()),
                IncidentMapper.toUserDto(r.getAssignedAgent()),
                r.getAssignmentGroup(),
                r.getStatus(),
                r.getApprovalStatus(),
                r.getApprover() != null ? r.getApprover().getName() : null,
                r.getApprovalDecisionAt(),
                r.getApprovalComments(),
                r.getJustification(),
                formData,
                r.getExpectedFulfillmentAt(),
                r.getCreatedAt(),
                r.getUpdatedAt(),
                r.getResolvedAt()
        );
    }
}
