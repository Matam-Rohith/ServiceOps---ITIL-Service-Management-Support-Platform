package com.serviceops.service;

import com.serviceops.dto.ProblemDto;
import com.serviceops.entity.Problem;
import com.serviceops.entity.ProblemStatus;
import com.serviceops.exception.ResourceNotFoundException;
import com.serviceops.repository.AuditLogRepository;
import com.serviceops.repository.ProblemRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

@Service
public class ProblemService {

    private final ProblemRepository problemRepository;
    private final AuditLogRepository auditLogRepository;

    public ProblemService(ProblemRepository problemRepository, AuditLogRepository auditLogRepository) {
        this.problemRepository = problemRepository;
        this.auditLogRepository = auditLogRepository;
    }

    @Transactional
    public ProblemDto createProblem(ProblemDto dto, String authorName) {
        String id = UUID.randomUUID().toString();
        long nextNum = problemRepository.count() + 2001;
        String probNum = "PRB-" + nextNum;

        Problem p = new Problem();
        p.setId(id);
        p.setProblemNumber(probNum);
        p.setTitle(dto.title());
        p.setDescription(dto.description());
        p.setCategory(dto.category() != null ? dto.category() : "INFRASTRUCTURE");
        p.setAssignedTeam(dto.assignedTeam() != null ? dto.assignedTeam() : "Infrastructure & Network L3");
        p.setAssignedAgentName(authorName);
        p.setRootCause(dto.rootCause());
        p.setWorkaround(dto.workaround());
        p.setKnownError(dto.isKnownError());
        p.setStatus(dto.status() != null ? dto.status() : ProblemStatus.UNDER_INVESTIGATION);
        p.setRelatedIncidentIds(dto.relatedIncidentIds() != null ? new ArrayList<>(dto.relatedIncidentIds()) : new ArrayList<>());
        p.setCreatedAt(Instant.now());
        p.setUpdatedAt(Instant.now());

        Problem saved = problemRepository.save(p);
        return toDto(saved);
    }

    @Transactional
    public ProblemDto updateProblem(String id, ProblemDto dto) {
        Problem p = problemRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with ID: " + id));

        p.setTitle(dto.title());
        p.setDescription(dto.description());
        p.setRootCause(dto.rootCause());
        p.setWorkaround(dto.workaround());
        p.setKnownError(dto.isKnownError());
        p.setStatus(dto.status());
        p.setUpdatedAt(Instant.now());
        if (dto.status() == ProblemStatus.RESOLVED || dto.status() == ProblemStatus.CLOSED) {
            p.setResolvedAt(Instant.now());
        }

        return toDto(problemRepository.save(p));
    }

    @Transactional
    public ProblemDto linkIncident(String problemId, String incidentId) {
        Problem p = problemRepository.findById(problemId)
                .orElseThrow(() -> new ResourceNotFoundException("Problem not found with ID: " + problemId));

        if (!p.getRelatedIncidentIds().contains(incidentId)) {
            p.getRelatedIncidentIds().add(incidentId);
            p.setUpdatedAt(Instant.now());
            p = problemRepository.save(p);
        }

        return toDto(p);
    }

    @Transactional(readOnly = true)
    public List<ProblemDto> getAllProblems() {
        return problemRepository.findAll().stream().map(this::toDto).toList();
    }

    private ProblemDto toDto(Problem p) {
        return new ProblemDto(
                p.getId(),
                p.getProblemNumber(),
                p.getTitle(),
                p.getDescription(),
                p.getCategory(),
                p.getAssignedTeam(),
                p.getAssignedAgentName(),
                p.getRootCause(),
                p.getWorkaround(),
                p.isKnownError(),
                p.getStatus(),
                p.getRelatedIncidentIds(),
                p.getCreatedAt(),
                p.getUpdatedAt(),
                p.getResolvedAt()
        );
    }
}
