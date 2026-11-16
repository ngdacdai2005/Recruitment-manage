package com.recruitment.repository;

import com.recruitment.entity.Application;
import com.recruitment.entity.enums.ApplicationStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ApplicationRepository extends JpaRepository<Application, Long> {

    boolean existsByCandidateIdAndJobId(Long candidateId, Long jobId);

    List<Application> findByCandidateIdOrderByCreatedAtDesc(Long candidateId);

    @Query("SELECT a FROM Application a WHERE " +
           "(:jobId IS NULL OR a.job.id = :jobId) " +
           "AND (:status IS NULL OR a.currentStatus = :status) " +
           "AND (:keyword IS NULL OR LOWER(a.candidate.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(a.candidate.email) LIKE LOWER(CONCAT('%', :keyword, '%')))")
    Page<Application> searchAdminApplications(
            @Param("jobId") Long jobId,
            @Param("status") ApplicationStatus status,
            @Param("keyword") String keyword,
            Pageable pageable
    );

    long countByCurrentStatus(ApplicationStatus status);

    long countByJobId(Long jobId);
}

