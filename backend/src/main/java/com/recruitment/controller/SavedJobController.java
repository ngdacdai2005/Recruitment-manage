package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.entity.SavedJob;
import com.recruitment.security.CustomUserDetails;
import com.recruitment.service.SavedJobService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/candidate/saved-jobs")
@RequiredArgsConstructor
@Tag(name = "Candidate Saved Jobs", description = "Quản lý việc làm đã lưu của ứng viên")
public class SavedJobController {

    private final SavedJobService savedJobService;

    @GetMapping
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    @Operation(summary = "Lấy danh sách việc làm đã lưu")
    public ResponseEntity<ApiResponse<List<SavedJob>>> getSavedJobs(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<SavedJob> savedJobs = savedJobService.getSavedJobs(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(savedJobs));
    }

    @PostMapping("/{jobId}/toggle")
    @PreAuthorize("hasAuthority('ROLE_CANDIDATE')")
    @Operation(summary = "Lưu hoặc bỏ lưu việc làm")
    public ResponseEntity<ApiResponse<Map<String, Object>>> toggleSavedJob(
            @PathVariable Long jobId,
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        boolean saved = savedJobService.toggleSaveJob(userDetails.getId(), jobId);
        return ResponseEntity.ok(ApiResponse.ok(
                saved ? "Đã lưu việc làm vào danh sách quan tâm" : "Đã hủy lưu việc làm",
                Map.of("jobId", jobId, "saved", saved)
        ));
    }
}
