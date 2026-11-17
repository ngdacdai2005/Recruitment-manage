package com.recruitment.controller;

import com.recruitment.dto.request.CreateEmployeeRequest;
import com.recruitment.dto.request.UpdateEmployeeRequest;
import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.EmployeeResponse;
import com.recruitment.dto.response.PageResponse;
import com.recruitment.entity.User;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.CustomUserDetails;
import com.recruitment.service.EmployeeService;
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

@RestController
@RequestMapping("/admin/employees")
@RequiredArgsConstructor
@Tag(name = "Employees", description = "Quản lý Hồ sơ nhân sự và Nhân viên nội bộ")
@PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER', 'ROLE_RECRUITER')")
public class EmployeeController {

    private final EmployeeService employeeService;
    private final UserRepository userRepository;

    @GetMapping
    @Operation(summary = "Tìm kiếm và phân trang danh sách nhân viên")
    public ResponseEntity<ApiResponse<PageResponse<EmployeeResponse>>> getEmployees(
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) Integer departmentId,
            @RequestParam(required = false) Long positionId,
            @RequestParam(required = false) Integer status,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "desc") String sortDir
    ) {
        Sort sort = sortDir.equalsIgnoreCase("asc") ? Sort.by(sortBy).ascending() : Sort.by(sortBy).descending();
        Pageable pageable = PageRequest.of(page, size, sort);
        PageResponse<EmployeeResponse> response = employeeService.getEmployees(keyword, departmentId, positionId, status, pageable);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết hồ sơ nhân sự theo ID")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getEmployeeById(id)));
    }

    @GetMapping("/by-user/{userId}")
    @Operation(summary = "Lấy hồ sơ nhân sự theo User ID")
    public ResponseEntity<ApiResponse<EmployeeResponse>> getEmployeeByUserId(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok(employeeService.getEmployeeByUserId(userId)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Tạo mới nhân viên và khởi tạo tài khoản đăng nhập")
    public ResponseEntity<ApiResponse<EmployeeResponse>> createEmployee(
            @Valid @RequestBody CreateEmployeeRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = userDetails != null ? userRepository.findById(userDetails.getId()).orElse(null) : null;
        EmployeeResponse response = employeeService.createEmployee(request, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Tạo hồ sơ nhân viên thành công", response));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Cập nhật hồ sơ nhân viên")
    public ResponseEntity<ApiResponse<EmployeeResponse>> updateEmployee(
            @PathVariable Long id,
            @Valid @RequestBody UpdateEmployeeRequest request,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = userDetails != null ? userRepository.findById(userDetails.getId()).orElse(null) : null;
        EmployeeResponse response = employeeService.updateEmployee(id, request, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Cập nhật hồ sơ nhân viên thành công", response));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Xóa mềm hồ sơ nhân sự và vô hiệu hóa tài khoản")
    public ResponseEntity<ApiResponse<Void>> deleteEmployee(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails userDetails
    ) {
        User currentUser = userDetails != null ? userRepository.findById(userDetails.getId()).orElse(null) : null;
        employeeService.deleteEmployee(id, currentUser);
        return ResponseEntity.ok(ApiResponse.ok("Đã xóa nhân viên thành công", null));
    }
}
