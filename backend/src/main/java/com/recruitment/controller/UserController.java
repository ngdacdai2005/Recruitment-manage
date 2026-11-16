package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.entity.User;
import com.recruitment.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/users")
@RequiredArgsConstructor
@Tag(name = "Admin User Management", description = "Quản lý tài khoản và phân quyền người dùng")
public class UserController {

    private final UserService userService;

    @GetMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Lấy danh sách tất cả người dùng trong hệ thống")
    public ResponseEntity<ApiResponse<List<User>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.ok(userService.getAllUsers()));
    }

    @PatchMapping("/{id}/role")
    @PreAuthorize("hasAuthority('ROLE_SUPER_ADMIN')")
    @Operation(summary = "Cập nhật vai trò (Role) của người dùng")
    public ResponseEntity<ApiResponse<User>> updateUserRole(
            @PathVariable Long id,
            @RequestBody Map<String, String> request) {
        String roleName = request.get("role");
        User updated = userService.updateUserRole(id, roleName);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật vai trò thành công", updated));
    }

    @PatchMapping("/{id}/toggle-active")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Khóa hoặc mở khóa tài khoản")
    public ResponseEntity<ApiResponse<User>> toggleActive(@PathVariable Long id) {
        User updated = userService.toggleUserActive(id);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật trạng thái tài khoản thành công", updated));
    }
}
