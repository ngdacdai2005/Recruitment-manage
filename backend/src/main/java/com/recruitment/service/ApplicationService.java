package com.recruitment.service;

import com.recruitment.dto.request.ApplyJobRequest;
import com.recruitment.dto.request.ChangeStatusRequest;
import com.recruitment.dto.response.PageResponse;
import com.recruitment.entity.Application;
import com.recruitment.entity.ApplicationHistory;
import com.recruitment.entity.Candidate;
import com.recruitment.entity.Job;
import com.recruitment.entity.User;
import com.recruitment.entity.enums.ApplicationStatus;
import com.recruitment.entity.enums.JobStatus;
import com.recruitment.exception.AppException;
import com.recruitment.repository.ApplicationHistoryRepository;
import com.recruitment.repository.ApplicationRepository;
import com.recruitment.repository.CandidateRepository;
import com.recruitment.repository.JobRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final ApplicationRepository applicationRepository;
    private final ApplicationHistoryRepository historyRepository;
    private final CandidateRepository candidateRepository;
    private final JobRepository jobRepository;

    @Transactional
    public Application applyJob(Long userId, ApplyJobRequest request) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException("Hồ sơ ứng viên không tồn tại", HttpStatus.NOT_FOUND));

        Job job = jobRepository.findById(request.getJobId())
                .orElseThrow(() -> new AppException("Tin tuyển dụng không tồn tại", HttpStatus.NOT_FOUND));

        if (job.getStatus() != JobStatus.PUBLISHED) {
            throw new AppException("Vị trí này hiện đang không nhận hồ sơ ứng tuyển", HttpStatus.BAD_REQUEST);
        }

        if (job.getDeadline() != null && job.getDeadline().isBefore(LocalDate.now())) {
            throw new AppException("Vị trí này đã hết hạn nộp hồ sơ", HttpStatus.BAD_REQUEST);
        }

        if (applicationRepository.existsByCandidateIdAndJobId(candidate.getId(), job.getId())) {
            throw new AppException("Bạn đã nộp hồ sơ vào vị trí này rồi. Vui lòng theo dõi trạng thái tại mục Hồ sơ của tôi.", HttpStatus.CONFLICT);
        }

        Application application = Application.builder()
                .candidate(candidate)
                .job(job)
                .resumeUrl(request.getResumeUrl())
                .resumeFilename(request.getResumeFilename())
                .coverLetter(request.getCoverLetter())
                .expectedSalary(request.getExpectedSalary())
                .availableDate(request.getAvailableDate())
                .currentStatus(ApplicationStatus.APPLIED)
                .build();

        Application saved = applicationRepository.save(application);

        // Ghi log lịch sử ban đầu
        ApplicationHistory initialHistory = ApplicationHistory.builder()
                .application(saved)
                .fromStatus(null)
                .toStatus(ApplicationStatus.APPLIED)
                .note("Hồ sơ đã được gửi thành công bởi ứng viên")
                .changedBy(candidate.getUser())
                .build();
        historyRepository.save(initialHistory);

        return saved;
    }

    public List<Application> getCandidateApplications(Long userId) {
        Candidate candidate = candidateRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException("Hồ sơ ứng viên không tồn tại", HttpStatus.NOT_FOUND));
        return applicationRepository.findByCandidateIdOrderByCreatedAtDesc(candidate.getId());
    }

    public List<ApplicationHistory> getApplicationTrackingHistory(Long applicationId) {
        return historyRepository.findByApplicationIdOrderByCreatedAtAsc(applicationId);
    }

    public PageResponse<Application> getAdminApplications(Long jobId, ApplicationStatus status, String keyword, Pageable pageable) {
        Page<Application> page = applicationRepository.searchAdminApplications(jobId, status, keyword, pageable);
        return PageResponse.from(page);
    }

    @Transactional
    public Application transitionStatus(Long applicationId, ChangeStatusRequest request, User adminUser) {
        Application application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new AppException("Không tìm thấy đơn ứng tuyển", HttpStatus.NOT_FOUND));

        ApplicationStatus fromStatus = application.getCurrentStatus();
        ApplicationStatus toStatus = request.getToStatus();

        if (fromStatus == toStatus) {
            return application;
        }

        // Quy tắc 1: Hồ sơ đã ở trạng thái kết thúc (REJECTED / WITHDRAWN) không được chuyển tiếp
        if (fromStatus == ApplicationStatus.REJECTED || fromStatus == ApplicationStatus.WITHDRAWN) {
            throw new AppException("Không thể chuyển đổi trạng thái đối với hồ sơ đã kết thúc (" + fromStatus + ")", HttpStatus.BAD_REQUEST);
        }

        // Quy tắc 2: Nếu chuyển sang REJECTED, bắt buộc phải có lý do
        if (toStatus == ApplicationStatus.REJECTED && (request.getRejectionReason() == null || request.getRejectionReason().isBlank())) {
            throw new AppException("Bắt buộc phải ghi nhận lý do từ chối hồ sơ ứng viên", HttpStatus.BAD_REQUEST);
        }

        // Quy tắc 3: Không thể chuyển sang HIRED nếu chưa từng qua OFFER
        if (toStatus == ApplicationStatus.HIRED && fromStatus != ApplicationStatus.OFFER) {
            throw new AppException("Ứng viên phải nhận thư đề nghị nhận việc (OFFER) trước khi chuyển sang Tuyển thành công (HIRED)", HttpStatus.BAD_REQUEST);
        }

        // Cập nhật trạng thái
        application.setCurrentStatus(toStatus);
        if (toStatus == ApplicationStatus.REJECTED) {
            application.setRejectionReason(request.getRejectionReason());
        }

        Application updated = applicationRepository.save(application);

        // Ghi nhận Audit History
        ApplicationHistory history = ApplicationHistory.builder()
                .application(updated)
                .fromStatus(fromStatus)
                .toStatus(toStatus)
                .note(request.getNote())
                .rejectionReason(request.getRejectionReason())
                .changedBy(adminUser)
                .build();
        historyRepository.save(history);

        return updated;
    }
}

