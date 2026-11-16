package com.recruitment.repository;

import com.recruitment.entity.Interview;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface InterviewRepository extends JpaRepository<Interview, Long> {
    List<Interview> findByInterviewerIdOrderByScheduledAtDesc(Long interviewerId);

    @Query("SELECT i FROM Interview i WHERE i.application.candidate.user.id = :userId ORDER BY i.scheduledAt DESC")
    List<Interview> findByCandidateUserId(@Param("userId") Long userId);

    List<Interview> findAllByOrderByScheduledAtDesc();
    long countByStatus(String status);
}

