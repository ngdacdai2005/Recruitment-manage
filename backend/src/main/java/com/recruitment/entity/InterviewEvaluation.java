package com.recruitment.entity;

import jakarta.persistence.*;
import lombok.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@Entity
@Table(name = "interview_evaluations")
@EntityListeners(AuditingEntityListener.class)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class InterviewEvaluation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "interview_id", unique = true, nullable = false)
    private Interview interview;

    private Integer technicalScore;       // 1 - 10
    private Integer communicationScore;   // 1 - 10
    private Integer problemSolvingScore;  // 1 - 10
    private Integer teamworkScore;        // 1 - 10

    @Column(columnDefinition = "TEXT")
    private String generalNotes;

    @Builder.Default
    @Column(nullable = false, length = 30)
    private String result = "PENDING"; // PASS, FAIL, PENDING

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "submitted_by")
    private User submittedBy;

    @CreatedDate
    @Column(updatable = false)
    private LocalDateTime createdAt;
}

