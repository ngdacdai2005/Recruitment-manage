package com.recruitment.service;

import com.recruitment.dto.response.PageResponse;
import com.recruitment.entity.Department;
import com.recruitment.entity.Job;
import com.recruitment.entity.User;
import com.recruitment.entity.enums.JobStatus;
import com.recruitment.exception.AppException;
import com.recruitment.repository.DepartmentRepository;
import com.recruitment.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.Normalizer;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
@RequiredArgsConstructor
public class JobService {

    private final JobRepository jobRepository;
    private final DepartmentRepository departmentRepository;

    private static final Pattern NONLATIN = Pattern.compile("[^\\w-]");
    private static final Pattern WHITESPACE = Pattern.compile("[\\s]");

    public static String toSlug(String input) {
        String nowhitespace = WHITESPACE.matcher(input).replaceAll("-");
        String normalized = Normalizer.normalize(nowhitespace, Normalizer.Form.NFD);
        String slug = NONLATIN.matcher(normalized).replaceAll("");
        return slug.toLowerCase(Locale.ENGLISH).replaceAll("-+", "-");
    }

    public PageResponse<Job> getPublicJobs(String keyword, Integer departmentId, String location, String jobLevel, String employmentType, Pageable pageable) {
        Page<Job> page = jobRepository.searchPublicJobs(keyword, departmentId, location, jobLevel, employmentType, pageable);
        return PageResponse.from(page);
    }

    public Job getJobBySlug(String slug) {
        return jobRepository.findBySlug(slug)
                .orElseThrow(() -> new AppException("Không tìm thấy tin tuyển dụng", HttpStatus.NOT_FOUND));
    }

    public Job getJobById(Long id) {
        return jobRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy tin tuyển dụng với ID: " + id, HttpStatus.NOT_FOUND));
    }

    public PageResponse<Job> getAdminJobs(String keyword, JobStatus status, Integer departmentId, Pageable pageable) {
        Page<Job> page = jobRepository.searchAdminJobs(keyword, status, departmentId, pageable);
        return PageResponse.from(page);
    }

    @Transactional
    public Job createJob(Job job, Integer departmentId, User currentUser) {
        Department department = departmentRepository.findById(departmentId)
                .orElseThrow(() -> new AppException("Phòng ban không tồn tại", HttpStatus.BAD_REQUEST));

        job.setDepartment(department);
        job.setCreatedBy(currentUser);

        String baseSlug = toSlug(job.getTitle());
        String finalSlug = baseSlug;
        int count = 1;
        while (jobRepository.findBySlug(finalSlug).isPresent()) {
            finalSlug = baseSlug + "-" + count++;
        }
        job.setSlug(finalSlug);

        if (job.getStatus() == null) {
            job.setStatus(JobStatus.DRAFT);
        }

        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJob(Long id, Job updatedJob, Integer departmentId) {
        Job job = getJobById(id);

        if (departmentId != null) {
            Department department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new AppException("Phòng ban không tồn tại", HttpStatus.BAD_REQUEST));
            job.setDepartment(department);
        }

        job.setTitle(updatedJob.getTitle());
        job.setJobLevel(updatedJob.getJobLevel());
        job.setEmploymentType(updatedJob.getEmploymentType());
        job.setLocation(updatedJob.getLocation());
        job.setSalaryMin(updatedJob.getSalaryMin());
        job.setSalaryMax(updatedJob.getSalaryMax());
        job.setIsSalaryNegotiable(updatedJob.getIsSalaryNegotiable());
        job.setExperienceYears(updatedJob.getExperienceYears());
        job.setQuantity(updatedJob.getQuantity());
        job.setDescription(updatedJob.getDescription());
        job.setRequirements(updatedJob.getRequirements());
        job.setBenefits(updatedJob.getBenefits());
        job.setDeadline(updatedJob.getDeadline());

        return jobRepository.save(job);
    }

    @Transactional
    public Job updateJobStatus(Long id, JobStatus newStatus) {
        Job job = getJobById(id);
        job.setStatus(newStatus);
        return jobRepository.save(job);
    }
}

