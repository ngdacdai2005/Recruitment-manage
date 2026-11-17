package com.recruitment.dto.response;

import com.recruitment.entity.enums.ContractType;
import com.recruitment.entity.enums.Gender;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EmployeeResponse {
    private Long id;
    private Long userId;
    private String employeeCode;
    private String email;
    private String fullName;
    private String shortName;
    private String phone;
    private Gender gender;
    private Integer genderCode;
    private LocalDate dob;
    private String address;
    private String avatar;
    private String profile;

    // Pháp lý & Ngân hàng
    private String cccd;
    private LocalDate cccdIssueDate;
    private String cccdIssuePlace;
    private String bankAccount;
    private String bankName;

    // Công việc & Hợp đồng
    private LocalDate joinDate;
    private ContractType contractType;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

    // Cơ cấu tổ chức & Phân quyền
    private Integer departmentId;
    private String departmentName;
    private Long positionId;
    private String positionName;
    private String roleName;

    // Trạng thái & Kiểm toán
    private Integer status;
    private Boolean isDelete;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
