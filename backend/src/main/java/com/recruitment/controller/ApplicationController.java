package com.recruitment.controller;

import com.recruitment.dto.request.ApplyJobRequest;
import com.recruitment.dto.request.ChangeStatusRequest;
import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.PageResponse;
import com.recruitment.entity.Application;
import com.recruitment.entity.ApplicationHistory;
import com.recruitment.entity.User;
import com.recruitment.entity.enums.ApplicationStatus;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.CustomUserDetails;
import com.recruitment.service.ApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Applications & Pipeline", description = "Quy trình ứng tuyển, theo dõi trạng thái hồ sơ & Kanban ATS")
public class ApplicationController {

    private final ApplicationService applicationService;
    private final UserRepository userRepository;

    // --- CANDIDATE PORTAL APIS ---

    @PostMapping("/candidate/applications/apply")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    @Operation(summary = "Ứng viên nộp hồ sơ vào vị trí tuyển dụng")
    public ResponseEntity<ApiResponse<Application>> applyJob(
            @Valid @RequestBody ApplyJobRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Application application = applicationService.applyJob(userDetails.getId(), request);
        return ResponseEntity.ok(ApiResponse.ok("Ứng tuyển thành công! Nhà tuyển dụng sẽ sớm phản hồi.", application));
    }

    @GetMapping("/candidate/applications/my-applications")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    @Operation(summary = "Xem danh sách các đơn đã ứng tuyển của ứng viên đang đăng nhập")
    public ResponseEntity<ApiResponse<List<Application>>> getMyApplications(
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getCandidateApplications(userDetails.getId())));
    }

    @GetMapping("/candidate/applications/{id}/tracking")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    @Operation(summary = "Xem dòng thời gian tiến độ hồ sơ (Timeline Tracking)")
    public ResponseEntity<ApiResponse<List<ApplicationHistory>>> getApplicationTracking(
            @PathVariable Long id
    ) {
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getApplicationTrackingHistory(id)));
    }

    // --- ADMIN / HR PORTAL APIS ---

    @GetMapping("/admin/applications")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_INTERVIEWER')")
    @Operation(summary = "Quản lý danh sách ứng viên theo vị trí & lọc trạng thái Pipeline (Kanban Board)")
    public ResponseEntity<ApiResponse<PageResponse<Application>>> getAdminApplications(
            @RequestParam(required = false) Long jobId,
            @RequestParam(required = false) ApplicationStatus status,
            @RequestParam(required = false) String keyword,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "50") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<Application> result = applicationService.getAdminApplications(jobId, status, keyword, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PatchMapping("/admin/applications/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER')")
    @Operation(summary = "Chuyển giai đoạn ứng viên trong Pipeline (Kéo thả Kanban / Duyệt vòng)")
    public ResponseEntity<ApiResponse<Application>> updateApplicationStatus(
            @PathVariable Long id,
            @Valid @RequestBody ChangeStatusRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        Application updated = applicationService.transitionStatus(id, request, user);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái ứng viên thành công", updated));
    }
}

