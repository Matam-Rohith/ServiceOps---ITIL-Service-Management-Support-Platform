package com.serviceops.repository;

import com.serviceops.entity.Problem;
import com.serviceops.entity.ProblemStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProblemRepository extends JpaRepository<Problem, String> {
    Optional<Problem> findByProblemNumber(String problemNumber);
    List<Problem> findByStatus(ProblemStatus status);
    List<Problem> findByIsKnownErrorTrue();
}
