package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.PageResponse;
import com.recruitment.entity.Job;
import com.recruitment.entity.User;
import com.recruitment.entity.enums.JobStatus;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.CustomUserDetails;
import com.recruitment.service.JobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/jobs")
@RequiredArgsConstructor
@Tag(name = "Jobs", description = "Quản lý tin tuyển dụng (Public & Admin)")
public class JobController {

    private final JobService jobService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Tìm kiếm tin tuyển dụng đang mở (Public)")
    public ResponseEntity<ApiResponse<PageResponse<Job>>> getPublicJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) String location,
            @RequestParam(required = false) String jobLevel,
            @RequestParam(required = false) String employmentType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "createdAt") String sortBy,
            @RequestParam(defaultValue = "desc") String direction
    ) {
        Sort sort = direction.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<Job> result = jobService.getPublicJobs(keyword, departmentId, location, jobLevel, employmentType, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{slug}")
    @Operation(summary = "Xem chi tiết tin tuyển dụng bằng Slug (Public)")
    public ResponseEntity<ApiResponse<Job>> getJobBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(jobService.getJobBySlug(slug)));
    }

    @GetMapping("/admin/list")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER')")
    @Operation(summary = "Quản lý danh sách toàn bộ tin tuyển dụng (Admin/HR)")
    public ResponseEntity<ApiResponse<PageResponse<Job>>> getAdminJobs(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) JobStatus status,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        PageResponse<Job> result = jobService.getAdminJobs(keyword, status, departmentId, pageable);
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @PostMapping("/admin")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER')")
    @Operation(summary = "Tạo tin tuyển dụng mới (Admin/HR)")
    public ResponseEntity<ApiResponse<Job>> createJob(
            @RequestBody Job job,
            @RequestParam Integer departmentId,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User user = userRepository.findById(userDetails.getId()).orElse(null);
        Job created = jobService.createJob(job, departmentId, user);
        return ResponseEntity.ok(ApiResponse.ok("Tạo tin tuyển dụng thành công", created));
    }

    @PatchMapping("/admin/{id}/status")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Thay đổi trạng thái tin tuyển dụng: DRAFT, PENDING_APPROVAL, PUBLISHED, CLOSED")
    public ResponseEntity<ApiResponse<Job>> updateJobStatus(
            @PathVariable Long id,
            @RequestParam JobStatus status
    ) {
        Job updated = jobService.updateJobStatus(id, status);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái thành công", updated));
    }
}

