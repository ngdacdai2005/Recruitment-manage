package com.recruitment.controller;

import com.recruitment.dto.request.EvaluationRequest;
import com.recruitment.dto.request.ScheduleInterviewRequest;
import com.recruitment.dto.response.ApiResponse;
import com.recruitment.entity.Interview;
import com.recruitment.entity.InterviewEvaluation;
import com.recruitment.entity.User;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.CustomUserDetails;
import com.recruitment.service.InterviewService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Interviews & Evaluations", description = "Quản lý lịch phỏng vấn & Phiếu đánh giá chuyên môn")
public class InterviewController {

    private final InterviewService interviewService;
    private final UserRepository userRepository;

    @PostMapping("/admin/interviews")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER')")
    @Operation(summary = "Lên lịch phỏng vấn cho ứng viên")
    public ResponseEntity<ApiResponse<Interview>> scheduleInterview(@Valid @RequestBody ScheduleInterviewRequest req) {
        Interview saved = interviewService.scheduleInterview(req);
        return ResponseEntity.ok(ApiResponse.ok("Lên lịch phỏng vấn thành công", saved));
    }

    @GetMapping("/admin/interviews")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_INTERVIEWER', 'ROLE_DEPARTMENT_HEAD')")
    @Operation(summary = "Xem danh sách lịch phỏng vấn (Admin/HR/Interviewer)")
    public ResponseEntity<ApiResponse<List<Interview>>> getAdminInterviews(
            @RequestParam(required = false) Long interviewerId
    ) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getAdminInterviews(interviewerId)));
    }

    @GetMapping("/candidate/interviews")
    @PreAuthorize("hasAnyAuthority('ROLE_CANDIDATE', 'ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Ứng viên xem lịch phỏng vấn của mình")
    public ResponseEntity<ApiResponse<List<Interview>>> getCandidateInterviews(@AuthenticationPrincipal CustomUserDetails userDetails) {
        return ResponseEntity.ok(ApiResponse.ok(interviewService.getCandidateInterviews(userDetails.getId())));
    }

    @PostMapping("/admin/interviews/{id}/evaluate")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER', 'ROLE_INTERVIEWER')")
    @Operation(summary = "Chấm điểm và đánh giá phỏng vấn ứng viên")
    public ResponseEntity<ApiResponse<InterviewEvaluation>> evaluateInterview(
            @PathVariable Long id,
            @Valid @RequestBody EvaluationRequest req,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User evaluator = userRepository.findById(userDetails.getId()).orElse(null);
        InterviewEvaluation saved = interviewService.evaluateInterview(id, req, evaluator);
        return ResponseEntity.ok(ApiResponse.ok("Đã lưu kết quả đánh giá phỏng vấn", saved));
    }
}

