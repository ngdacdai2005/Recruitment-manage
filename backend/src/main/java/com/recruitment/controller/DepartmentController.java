package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.entity.Department;
import com.recruitment.repository.DepartmentRepository;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/departments")
@RequiredArgsConstructor
@Tag(name = "Departments", description = "Quản lý cơ cấu phòng ban")
public class DepartmentController {

    private final DepartmentRepository departmentRepository;

    @GetMapping
    @Operation(summary = "Lấy danh sách các phòng ban đang hoạt động (Public)")
    public ResponseEntity<ApiResponse<List<Department>>> getAllActiveDepartments() {
        return ResponseEntity.ok(ApiResponse.ok(departmentRepository.findByIsActiveTrue()));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Tạo phòng ban mới (Admin / HR Manager)")
    public ResponseEntity<ApiResponse<Department>> createDepartment(@RequestBody Department department) {
        Department saved = departmentRepository.save(department);
        return ResponseEntity.ok(ApiResponse.ok("Tạo phòng ban thành công", saved));
    }
}

