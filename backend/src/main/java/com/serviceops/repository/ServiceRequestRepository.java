package com.serviceops.repository;

import com.serviceops.entity.ServiceRequest;
import com.serviceops.entity.ApprovalStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ServiceRequestRepository extends JpaRepository<ServiceRequest, String> {
    Optional<ServiceRequest> findByRequestNumber(String requestNumber);
    List<ServiceRequest> findByRequesterId(String requesterId);
    List<ServiceRequest> findByApprovalStatus(ApprovalStatus approvalStatus);
    List<ServiceRequest> findByStatus(String status);
}
