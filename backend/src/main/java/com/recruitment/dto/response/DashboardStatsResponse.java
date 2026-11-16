package com.recruitment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Map;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DashboardStatsResponse {
    private long totalPublishedJobs;
    private long totalCandidates;
    private long totalApplications;
    private long totalInterviews;
    private long totalHired;
    private Map<String, Long> statusBreakdown;
    private double conversionRate; // (Hired / Total Applications) * 100
}

