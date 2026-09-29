package com.serviceops.mapper;

import com.serviceops.dto.IncidentResponse;
import com.serviceops.dto.UserDto;
import com.serviceops.entity.Incident;
import com.serviceops.entity.User;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Component
public class IncidentMapper {

    public static UserDto toUserDto(User user) {
        if (user == null) return null;
        return new UserDto(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getRole(),
                user.getDepartment(),
                user.getTeam(),
                user.getPhone(),
                user.getAvatarUrl()
        );
    }

    public IncidentResponse toResponse(Incident inc, String assetName) {
        if (inc == null) return null;

        Instant now = Instant.now();
        long elapsedMins = Duration.between(inc.getCreatedAt(), inc.getResolvedAt() != null ? inc.getResolvedAt() : now).toMinutes();
        long remainingMins = Duration.between(now, inc.getResolutionDeadline()).toMinutes();

        return new IncidentResponse(
                inc.getId(),
                inc.getVersion(),
                inc.getIncidentNumber(),
                inc.getTitle(),
                inc.getDescription(),
                toUserDto(inc.getRequester()),
                toUserDto(inc.getAssignedAgent()),
                inc.getAssignmentGroup(),
                inc.getCategory(),
                inc.getSubcategory(),
                inc.getImpact(),
                inc.getUrgency(),
                inc.getPriority(),
                inc.getStatus(),
                inc.getSource(),
                inc.getAffectedAssetId(),
                assetName,
                inc.getAffectedService(),
                inc.getRelatedProblemId(),
                inc.getResolutionNotes(),
                inc.getPendingReason(),
                inc.getSlaPolicyName(),
                inc.getResponseDeadline(),
                inc.getResolutionDeadline(),
                inc.isResponseBreached(),
                inc.isResolutionBreached(),
                inc.getSlaStatus(),
                Math.max(0, elapsedMins),
                remainingMins,
                inc.getCreatedAt(),
                inc.getUpdatedAt(),
                inc.getFirstResponseAt(),
                inc.getResolvedAt(),
                inc.getClosedAt()
        );
    }
}
