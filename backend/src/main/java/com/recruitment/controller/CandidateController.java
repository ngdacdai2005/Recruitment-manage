package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.PageResponse;
import com.recruitment.entity.Candidate;
import com.recruitment.exception.AppException;
import com.recruitment.repository.CandidateRepository;
import com.recruitment.security.CustomUserDetails;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequiredArgsConstructor
@Tag(name = "Candidates", description = "Quản lý hồ sơ ứng viên và CV")
public class CandidateController {

    private final CandidateRepository candidateRepository;

    @GetMapping("/candidate/profile")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    @Operation(summary = "Lấy thông tin hồ sơ của ứng viên hiện tại")
    public ResponseEntity<ApiResponse<Candidate>> getMyProfile(@AuthenticationPrincipal CustomUserDetails userDetails) {
        Candidate candidate = candidateRepository.findByUserId(userDetails.getId())
                .orElseThrow(() -> new AppException("Hồ sơ chưa được khởi tạo", HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.ok(candidate));
    }

    @PutMapping("/candidate/profile")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    @Operation(summary = "Cập nhật thông tin cá nhân của ứng viên")
    public ResponseEntity<ApiResponse<Candidate>> updateProfile(
            @RequestBody Candidate req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        Candidate candidate = candidateRepository.findByUserId(userDetails.getId())
                .orElseThrow(() -> new AppException("Hồ sơ không tồn tại", HttpStatus.NOT_FOUND));

        candidate.setFullName(req.getFullName());
        candidate.setPhone(req.getPhone());
        candidate.setAddress(req.getAddress());
        candidate.setDateOfBirth(req.getDateOfBirth());
        candidate.setHeadline(req.getHeadline());
        candidate.setSummary(req.getSummary());

        Candidate updated = candidateRepository.save(candidate);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật hồ sơ thành công", updated));
    }

    @PostMapping("/candidate/cv-url")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    @Operation(summary = "Lưu đường dẫn CV mặc định của ứng viên")
    public ResponseEntity<ApiResponse<Candidate>> updateCvUrl(
            @RequestBody Map<String, String> body,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        String cvUrl = body.get("cvUrl");
        Candidate candidate = candidateRepository.findByUserId(userDetails.getId())
                .orElseThrow(() -> new AppException("Hồ sơ không tồn tại", HttpStatus.NOT_FOUND));

        candidate.setCurrentCvUrl(cvUrl);
        Candidate updated = candidateRepository.save(candidate);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật CV thành công", updated));
    }

    @GetMapping("/admin/candidates")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_INTERVIEWER', 'ROLE_DEPARTMENT_HEAD', 'ROLE_TALENT_SOURCER')")
    @Operation(summary = "Xem danh sách hồ sơ ứng viên (Admin/HR)")
    public ResponseEntity<ApiResponse<PageResponse<Candidate>>> getAllCandidates(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "15") int size
    ) {
        Page<Candidate> candidates = candidateRepository.findAll(PageRequest.of(page, size, Sort.by("createdAt").descending()));
        return ResponseEntity.ok(ApiResponse.ok(PageResponse.from(candidates)));
    }

    @GetMapping("/admin/candidates/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_INTERVIEWER')")
    @Operation(summary = "Xem hồ sơ chi tiết một ứng viên (Admin/HR)")
    public ResponseEntity<ApiResponse<Candidate>> getCandidateById(@PathVariable Long id) {
        Candidate candidate = candidateRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy ứng viên", HttpStatus.NOT_FOUND));
        return ResponseEntity.ok(ApiResponse.ok(candidate));
    }
}

