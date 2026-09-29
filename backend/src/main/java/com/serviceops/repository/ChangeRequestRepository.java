package com.serviceops.repository;

import com.serviceops.entity.ChangeRequest;
import com.serviceops.entity.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ChangeRequestRepository extends JpaRepository<ChangeRequest, String> {
    Optional<ChangeRequest> findByChangeNumber(String changeNumber);
    List<ChangeRequest> findByApprovalStatus(ApprovalStatus approvalStatus);
    List<ChangeRequest> findByImplementationStatus(String implementationStatus);
}
