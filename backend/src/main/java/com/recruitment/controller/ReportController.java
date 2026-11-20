package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.DashboardStatsResponse;
import com.recruitment.entity.enums.ApplicationStatus;
import com.recruitment.entity.enums.JobStatus;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.CandidateRepository;
import com.recruitment.repository.InterviewRepository;
import com.recruitment.repository.JobRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/admin/reports")
@RequiredArgsConstructor
@Tag(name = "Reports & Analytics", description = "Báo cáo KPI, Phân tích số liệu tuyển dụng")
public class ReportController {

    private final JobRepository jobRepository;
    private final ApplicationRepository applicationRepository;
    private final CandidateRepository candidateRepository;
    private final InterviewRepository interviewRepository;

    @GetMapping("/dashboard")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_INTERVIEWER', 'ROLE_DEPARTMENT_HEAD', 'ROLE_TALENT_SOURCER', 'ROLE_HR_ASSISTANT', 'ROLE_SYSTEM_AUDITOR')")
    @Operation(summary = "Lấy dữ liệu thống kê tổng quan cho Admin Dashboard")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> getDashboardOverview() {
        long publishedJobs = jobRepository.countByStatus(JobStatus.PUBLISHED);
        long totalCandidates = candidateRepository.count();
        long totalApplications = applicationRepository.count();
        long totalInterviews = interviewRepository.count();

        Map<String, Long> statusBreakdown = new HashMap<>();
        for (ApplicationStatus status : ApplicationStatus.values()) {
            statusBreakdown.put(status.name(), applicationRepository.countByCurrentStatus(status));
        }

        long hiredCount = statusBreakdown.getOrDefault(ApplicationStatus.HIRED.name(), 0L);
        double conversionRate = totalApplications > 0 ? (double) hiredCount / totalApplications * 100 : 0.0;

        DashboardStatsResponse stats = DashboardStatsResponse.builder()
                .totalPublishedJobs(publishedJobs)
                .totalCandidates(totalCandidates)
                .totalApplications(totalApplications)
                .totalInterviews(totalInterviews)
                .totalHired(hiredCount)
                .statusBreakdown(statusBreakdown)
                .conversionRate(Math.round(conversionRate * 10.0) / 10.0)
                .build();

        return ResponseEntity.ok(ApiResponse.ok(stats));
    }
}

