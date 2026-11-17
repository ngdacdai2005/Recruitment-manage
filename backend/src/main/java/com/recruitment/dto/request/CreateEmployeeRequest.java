package com.recruitment.dto.request;

import com.recruitment.entity.enums.ContractType;
import com.recruitment.entity.enums.Gender;
import jakarta.validation.constraints.Email;
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
public class CreateEmployeeRequest {

    @NotBlank(message = "Email không được để trống")
    @Email(message = "Email không đúng định dạng")
    private String email;

    private String password;

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

    private String employeeCode;

    @NotNull(message = "Ngày vào công ty không được để trống")
    private LocalDate joinDate;

    @NotNull(message = "Loại hợp đồng không được để trống")
    private ContractType contractType;

    private LocalDate contractStartDate;
    private LocalDate contractEndDate;

    private Integer departmentId;
    private Long positionId;
    private String roleName;
}
