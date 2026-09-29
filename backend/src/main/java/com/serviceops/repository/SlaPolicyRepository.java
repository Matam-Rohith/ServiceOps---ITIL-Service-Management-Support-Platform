package com.serviceops.repository;

import com.serviceops.entity.SlaPolicy;
import com.serviceops.entity.Priority;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SlaPolicyRepository extends JpaRepository<SlaPolicy, Priority> {
    Optional<SlaPolicy> findByPriority(Priority priority);
    List<SlaPolicy> findByActiveTrue();
}
