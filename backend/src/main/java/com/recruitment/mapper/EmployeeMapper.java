package com.recruitment.mapper;

import com.recruitment.dto.response.EmployeeResponse;
import com.recruitment.dto.response.PositionResponse;
import com.recruitment.entity.Employee;
import com.recruitment.entity.Position;
import org.springframework.stereotype.Component;

@Component
public class EmployeeMapper {

    public EmployeeResponse toResponse(Employee entity) {
        if (entity == null) {
            return null;
        }

        String email = entity.getUser() != null ? entity.getUser().getEmail() : null;
        String fullName = entity.getUser() != null ? entity.getUser().getFullName() : null;
        String roleName = (entity.getUser() != null && entity.getUser().getRole() != null)
                ? entity.getUser().getRole().getName() : null;

        Integer deptId = entity.getDepartment() != null ? entity.getDepartment().getId() : null;
        String deptName = entity.getDepartment() != null ? entity.getDepartment().getName() : null;

        Long posId = entity.getPosition() != null ? entity.getPosition().getId() : null;
        String posName = entity.getPosition() != null ? entity.getPosition().getName() : null;

        return EmployeeResponse.builder()
                .id(entity.getId())
                .userId(entity.getUser() != null ? entity.getUser().getId() : null)
                .employeeCode(entity.getEmployeeCode())
                .email(email)
                .fullName(fullName)
                .shortName(entity.getShortName())
                .phone(entity.getPhone())
                .gender(entity.getGender())
                .genderCode(entity.getGender() != null ? entity.getGender().ordinal() : null)
                .dob(entity.getDob())
                .address(entity.getAddress())
                .avatar(entity.getAvatar() != null ? entity.getAvatar() : (entity.getUser() != null ? entity.getUser().getAvatarUrl() : null))
                .profile(entity.getProfile())
                .cccd(entity.getCccd())
                .cccdIssueDate(entity.getCccdIssueDate())
                .cccdIssuePlace(entity.getCccdIssuePlace())
                .bankAccount(entity.getBankAccount())
                .bankName(entity.getBankName())
                .joinDate(entity.getJoinDate())
                .contractType(entity.getContractType())
                .contractStartDate(entity.getContractStartDate())
                .contractEndDate(entity.getContractEndDate())
                .departmentId(deptId)
                .departmentName(deptName)
                .positionId(posId)
                .positionName(posName)
                .roleName(roleName)
                .status(entity.getStatus())
                .isDelete(entity.getIsDelete())
                .createdAt(entity.getCreatedAt())
                .updatedAt(entity.getUpdatedAt())
                .build();
    }

    public PositionResponse toPositionResponse(Position entity) {
        if (entity == null) {
            return null;
        }

        return PositionResponse.builder()
                .id(entity.getId())
                .name(entity.getName())
                .code(entity.getCode())
                .description(entity.getDescription())
                .departmentId(entity.getDepartment() != null ? entity.getDepartment().getId() : null)
                .departmentName(entity.getDepartment() != null ? entity.getDepartment().getName() : null)
                .isActive(entity.getIsActive())
                .createdAt(entity.getCreatedAt())
                .build();
    }
}
