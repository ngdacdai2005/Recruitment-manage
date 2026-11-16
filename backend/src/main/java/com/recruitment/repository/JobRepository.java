package com.recruitment.repository;

import com.recruitment.entity.Job;
import com.recruitment.entity.enums.JobStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface JobRepository extends JpaRepository<Job, Long> {

    Optional<Job> findBySlug(String slug);

    @Query("SELECT j FROM Job j WHERE j.status = com.recruitment.entity.enums.JobStatus.PUBLISHED " +
           "AND (:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%')) OR LOWER(j.description) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:departmentId IS NULL OR j.department.id = :departmentId) " +
           "AND (:location IS NULL OR LOWER(j.location) LIKE LOWER(CONCAT('%', :location, '%'))) " +
           "AND (:jobLevel IS NULL OR j.jobLevel = :jobLevel) " +
           "AND (:employmentType IS NULL OR j.employmentType = :employmentType)")
    Page<Job> searchPublicJobs(
            @Param("keyword") String keyword,
            @Param("departmentId") Integer departmentId,
            @Param("location") String location,
            @Param("jobLevel") String jobLevel,
            @Param("employmentType") String employmentType,
            Pageable pageable
    );

    @Query("SELECT j FROM Job j WHERE " +
           "(:keyword IS NULL OR LOWER(j.title) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:status IS NULL OR j.status = :status) " +
           "AND (:departmentId IS NULL OR j.department.id = :departmentId)")
    Page<Job> searchAdminJobs(
            @Param("keyword") String keyword,
            @Param("status") JobStatus status,
            @Param("departmentId") Integer departmentId,
            Pageable pageable
    );

    long countByStatus(JobStatus status);
}

