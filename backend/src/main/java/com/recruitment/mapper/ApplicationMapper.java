package com.recruitment.mapper;

import com.recruitment.dto.request.ApplyJobRequest;
import com.recruitment.entity.Application;
import com.recruitment.entity.Candidate;
import com.recruitment.entity.Job;
import com.recruitment.entity.enums.ApplicationStatus;
import org.springframework.stereotype.Component;

@Component
public class ApplicationMapper {

    public Application toEntity(ApplyJobRequest request, Candidate candidate, Job job) {
        if (request == null) return null;
        return Application.builder()
                .candidate(candidate)
                .job(job)
                .resumeUrl(request.getResumeUrl())
                .resumeFilename(request.getResumeFilename())
                .coverLetter(request.getCoverLetter())
                .expectedSalary(request.getExpectedSalary())
                .availableDate(request.getAvailableDate())
                .currentStatus(ApplicationStatus.APPLIED)
                .build();
    }
}

