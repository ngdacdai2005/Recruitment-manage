package com.recruitment.controller;

import com.recruitment.dto.response.ApiResponse;
import com.recruitment.dto.response.PositionResponse;
import com.recruitment.service.PositionService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/positions")
@RequiredArgsConstructor
@Tag(name = "Positions", description = "Quản lý Chức danh và Vị trí công việc")
public class PositionController {

    private final PositionService positionService;

    @GetMapping
    @Operation(summary = "Lấy danh sách tất cả các vị trí chức danh")
    public ResponseEntity<ApiResponse<List<PositionResponse>>> getAllPositions() {
        return ResponseEntity.ok(ApiResponse.ok(positionService.getAllPositions()));
    }

    @GetMapping("/department/{departmentId}")
    @Operation(summary = "Lấy danh sách chức danh theo phòng ban")
    public ResponseEntity<ApiResponse<List<PositionResponse>>> getPositionsByDepartment(@PathVariable Integer departmentId) {
        return ResponseEntity.ok(ApiResponse.ok(positionService.getPositionsByDepartment(departmentId)));
    }

    @GetMapping("/{id}")
    @Operation(summary = "Lấy chi tiết chức danh theo ID")
    public ResponseEntity<ApiResponse<PositionResponse>> getPositionById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(positionService.getPositionById(id)));
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('ROLE_SUPER_ADMIN', 'ROLE_HR_MANAGER')")
    @Operation(summary = "Tạo mới vị trí chức danh")
    public ResponseEntity<ApiResponse<PositionResponse>> createPosition(
            @RequestParam String name,
            @RequestParam String code,
            @RequestParam(required = false) String description,
            @RequestParam(required = false) Integer departmentId
    ) {
        PositionResponse response = positionService.createPosition(name, code, description, departmentId);
        return ResponseEntity.ok(ApiResponse.ok("Tạo chức danh thành công", response));
    }
}
