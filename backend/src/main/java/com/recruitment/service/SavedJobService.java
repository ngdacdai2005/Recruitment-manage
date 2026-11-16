package com.recruitment.service;

import com.recruitment.entity.Candidate;
import com.recruitment.entity.Job;
import com.recruitment.entity.SavedJob;
import com.recruitment.exception.AppException;
import com.recruitment.repository.CandidateRepository;
import com.recruitment.repository.JobRepository;
import com.recruitment.repository.SavedJobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SavedJobService {

    private final SavedJobRepository savedJobRepository;
    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;

    public List<SavedJob> getSavedJobs(Long candidateUserId) {
        Candidate candidate = candidateRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new AppException("Hồ sơ ứng viên không tồn tại", HttpStatus.NOT_FOUND));
        return savedJobRepository.findByCandidateIdOrderByCreatedAtDesc(candidate.getId());
    }

    @Transactional
    public boolean toggleSaveJob(Long candidateUserId, Long jobId) {
        Candidate candidate = candidateRepository.findByUserId(candidateUserId)
                .orElseThrow(() -> new AppException("Hồ sơ ứng viên không tồn tại", HttpStatus.NOT_FOUND));

        Job job = jobRepository.findById(jobId)
                .orElseThrow(() -> new AppException("Tin tuyển dụng không tồn tại", HttpStatus.NOT_FOUND));

        if (savedJobRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            savedJobRepository.deleteByCandidateIdAndJobId(candidate.getId(), job.getId());
            return false; // Removed
        } else {
            SavedJob savedJob = SavedJob.builder()
                    .candidate(candidate)
                    .job(job)
                    .build();
            savedJobRepository.save(savedJob);
            return true; // Added
        }
    }
}

