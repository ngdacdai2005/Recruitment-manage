package com.recruitment.dto.request;

import com.recruitment.entity.enums.ContractType;
import com.recruitment.entity.enums.Gender;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UpdateEmployeeRequest {

    @NotBlank(message = "Họ và tên không được để trống")
    private String fullName;

    private String shortName;

    @NotBlank(message = "Số điện thoại không được để trống")
    private String phone;

    @NotNull(message = "Giới tính không được để trống")
    private Gender gender;

    private LocalDate dob;
    private String address;
    private String avatar;
    private String profile;

    @Pattern(regexp = "^$|[0-9]{12}", message = "CCCD phải đúng 12 chữ số")
    private String cccd;
    private LocalDate cccdIssueDate;
    private String cccdIssuePlace;

    private String bankAccount;
    private String bankName;

    private LocalDate joinDate;
    private ContractType contractType;
    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

    private Integer departmentId;
    private Long positionId;
    private Integer status; // 1: ACTIVE, 0: INACTIVE
}
