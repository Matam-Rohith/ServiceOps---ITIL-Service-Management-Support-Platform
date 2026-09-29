package com.serviceops.service;

import com.serviceops.dto.ChangeRequestDto;
import com.serviceops.entity.ApprovalStatus;
import com.serviceops.entity.ChangeRequest;
import com.serviceops.entity.ChangeType;
import com.serviceops.exception.ResourceNotFoundException;
import com.serviceops.repository.AuditLogRepository;
import com.serviceops.repository.ChangeRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;
import java.util.UUID;

@Service
public class ChangeService {

    private final ChangeRequestRepository changeRepository;
    private final AuditLogRepository auditLogRepository;

    public ChangeService(ChangeRequestRepository changeRepository, AuditLogRepository auditLogRepository) {
        this.changeRepository = changeRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public ChangeRequestDto createChange(ChangeRequestDto dto, String requesterName) {
        String id = UUID.randomUUID().toString();
        long nextNum = changeRepository.count() + 3001;
        String changeNumber = "CHG-" + nextNum;

        ChangeRequest c = new ChangeRequest();
        c.setId(id);
        c.setChangeNumber(changeNumber);
        c.setTitle(dto.title());
        c.setDescription(dto.description());
        c.setReason(dto.reason());
        c.setChangeType(dto.changeType());
        c.setRisk(dto.risk());
        c.setImpact(dto.impact());
        c.setAffectedService(dto.affectedService());
        c.setImplementationPlan(dto.implementationPlan());
        c.setRollbackPlan(dto.rollbackPlan());
        c.setTestPlan(dto.testPlan());
        c.setRequesterName(requesterName);
        c.setAssignedOwnerName(dto.assignedOwnerName() != null ? dto.assignedOwnerName() : requesterName);
        
        // Standard changes are pre-approved template changes
        boolean isStandard = dto.changeType() == ChangeType.STANDARD;
        c.setApprovalStatus(isStandard ? ApprovalStatus.APPROVED : ApprovalStatus.PENDING);
        c.setApproverName(isStandard ? "Standard Change Policy (Pre-Approved)" : null);
        c.setImplementationStatus("SCHEDULED");
        c.setScheduledStart(dto.scheduledStart() != null ? dto.scheduledStart() : Instant.now());
        c.setScheduledEnd(dto.scheduledEnd() != null ? dto.scheduledEnd() : Instant.now().plusSeconds(14400));
        c.setCreatedAt(Instant.now());
        c.setUpdatedAt(Instant.now());

        return toDto(changeRepository.save(c));
    }

    @Transactional
    public ChangeRequestDto approveChange(String id, String comments, String approverName) {
        ChangeRequest c = changeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Change request not found with ID: " + id));

        c.setApprovalStatus(ApprovalStatus.APPROVED);
        c.setApproverName(approverName);
        c.setApprovalComments(comments);
        c.setUpdatedAt(Instant.now());

        return toDto(changeRepository.save(c));
    }

    @Transactional(readOnly = true)
    public List<ChangeRequestDto> getAllChanges() {
        return changeRepository.findAll().stream().map(this::toDto).toList();
    }

    private ChangeRequestDto toDto(ChangeRequest c) {
        return new ChangeRequestDto(
                c.getId(),
                c.getChangeNumber(),
                c.getTitle(),
                c.getDescription(),
                c.getReason(),
                c.getChangeType(),
                c.getRisk(),
                c.getImpact(),
                c.getAffectedService(),
                c.getImplementationPlan(),
                c.getRollbackPlan(),
                c.getTestPlan(),
                c.getRequesterName(),
                c.getAssignedOwnerName(),
                c.getApprovalStatus(),
                c.getApproverName(),
                c.getApprovalComments(),
                c.getImplementationStatus(),
                c.getScheduledStart(),
                c.getScheduledEnd(),
                c.getCreatedAt(),
                c.getUpdatedAt()
        );
    }
}
