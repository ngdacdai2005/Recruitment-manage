package com.recruitment.controller;

import com.recruitment.dto.request.ForgotPasswordRequest;
import com.recruitment.dto.request.LoginRequest;
import com.recruitment.dto.request.RegisterRequest;
import com.recruitment.dto.request.ResetPasswordRequest;
import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.AuthResponse;
import com.recruitment.security.CustomUserDetails;
import com.recruitment.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Authentication", description = "Đăng nhập, Đăng ký, Cấp phát Token và Khôi phục mật khẩu")
public class AuthController {

    private final AuthService authService;

    @PostMapping("/login")
    @Operation(summary = "Đăng nhập: Kiểm tra password -> revoke session cũ -> tạo Access + Refresh Token -> lưu hash Refresh Token vào DB -> trả Cookie HttpOnly")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody LoginRequest request,
            HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.login(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Đăng nhập thành công", authResponse));
    }

    @PostMapping("/register")
    @Operation(summary = "Đăng ký tài khoản ứng viên mới")
    public ResponseEntity<ApiResponse<AuthResponse>> register(
            @Valid @RequestBody RegisterRequest request,
            HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.register(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Đăng ký tài khoản thành công", authResponse));
    }

    @PostMapping("/refresh")
    @Operation(summary = "Làm mới phiên: Đọc cookie -> verify signature & token_version -> so khớp hash SHA-256 -> cấp session mới")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        AuthResponse authResponse = authService.refresh(request, response);
        return ResponseEntity.ok(ApiResponse.ok("Làm mới phiên đăng nhập thành công", authResponse));
    }

    @PostMapping("/logout")
    @Operation(summary = "Đăng xuất: Đưa access JTI vào Redis blacklist -> set refresh_token = null -> clear cookie")
    public ResponseEntity<ApiResponse<Void>> logout(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletRequest request,
            HttpServletResponse response
    ) {
        authService.logout(authHeader, request, response);
        return ResponseEntity.ok(ApiResponse.ok("Đăng xuất thành công", null));
    }

    @PostMapping("/forgot-password")
    @Operation(summary = "Quên mật khẩu: Gửi email link xác nhận đặt lại mật khẩu")
    public ResponseEntity<ApiResponse<Void>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        authService.forgotPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Nếu email tồn tại trong hệ thống, hướng dẫn đặt lại mật khẩu đã được gửi", null));
    }

    @PostMapping("/reset-password")
    @Operation(summary = "Đặt lại mật khẩu: Xác thực token và cập nhật mật khẩu mới")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        authService.resetPassword(request);
        return ResponseEntity.ok(ApiResponse.ok("Đặt lại mật khẩu thành công. Vui lòng đăng nhập bằng mật khẩu mới", null));
    }

    @GetMapping("/me")
    @Operation(summary = "Lấy thông tin tài khoản đang đăng nhập")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getCurrentUser(@AuthenticationPrincipal CustomUserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).body(ApiResponse.error("Chưa xác thực"));
        }
        String role = userDetails.getAuthorities().iterator().next().getAuthority();
        return ResponseEntity.ok(ApiResponse.ok(Map.of(
                "id", userDetails.getId(),
                "email", userDetails.getUsername(),
                "fullName", userDetails.getFullName(),
                "role", role
        )));
    }
}
