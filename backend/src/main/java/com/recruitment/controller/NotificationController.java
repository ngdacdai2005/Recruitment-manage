package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.entity.Notification;
import com.recruitment.security.CustomUserDetails;
import com.recruitment.service.NotificationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/notifications")
@RequiredArgsConstructor
@Tag(name = "Notifications", description = "Quản lý thông báo người dùng")
public class NotificationController {

    private final NotificationService notificationService;

    @GetMapping("/my")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Lấy danh sách thông báo của tài khoản hiện tại")
    public ResponseEntity<ApiResponse<List<Notification>>> getMyNotifications(
            @AuthenticationPrincipal CustomUserDetails userDetails) {
        List<Notification> list = notificationService.getUserNotifications(userDetails.getId());
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @PatchMapping("/{id}/read")
    @PreAuthorize("isAuthenticated()")
    @Operation(summary = "Đánh dấu thông báo đã đọc")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        notificationService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.ok("Đã đánh dấu đã đọc", null));
    }
}
