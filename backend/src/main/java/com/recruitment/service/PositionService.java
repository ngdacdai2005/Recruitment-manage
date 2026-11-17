package com.recruitment.service;

import com.recruitment.dto.response.PositionResponse;
import com.recruitment.entity.Department;
import com.recruitment.entity.Position;
import com.recruitment.exception.AppException;
import com.recruitment.mapper.EmployeeMapper;
import com.recruitment.repository.DepartmentRepository;
import com.recruitment.repository.PositionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PositionService {

    private final PositionRepository positionRepository;
    private final DepartmentRepository departmentRepository;
    private final EmployeeMapper employeeMapper;

    public List<PositionResponse> getAllPositions() {
        return positionRepository.findAll().stream()
                .map(employeeMapper::toPositionResponse)
                .toList();
    }

    public List<PositionResponse> getPositionsByDepartment(Integer departmentId) {
        return positionRepository.findByDepartmentId(departmentId).stream()
                .map(employeeMapper::toPositionResponse)
                .toList();
    }

    public PositionResponse getPositionById(Long id) {
        Position position = positionRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy vị trí chức danh với ID: " + id, HttpStatus.NOT_FOUND));
        return employeeMapper.toPositionResponse(position);
    }

    @Transactional
    public PositionResponse createPosition(String name, String code, String description, Integer departmentId) {
        if (positionRepository.existsByCode(code)) {
            throw new AppException("Mã chức danh đã tồn tại: " + code, HttpStatus.CONFLICT);
        }

        Department department = null;
        if (departmentId != null) {
            department = departmentRepository.findById(departmentId)
                    .orElseThrow(() -> new AppException("Phòng ban không tồn tại với ID: " + departmentId, HttpStatus.NOT_FOUND));
        }

        Position position = Position.builder()
                .name(name)
                .code(code)
                .description(description)
                .department(department)
                .isActive(true)
                .build();

        return employeeMapper.toPositionResponse(positionRepository.save(position));
    }
}
