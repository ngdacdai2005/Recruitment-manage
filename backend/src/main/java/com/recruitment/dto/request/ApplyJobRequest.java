package com.recruitment.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ApplyJobRequest {
    @NotNull(message = "Mã vị trí tuyển dụng không được để trống")
    private Long jobId;

    @NotBlank(message = "Đường dẫn file CV không được để trống")
    private String resumeUrl;

    private String resumeFilename;
    private String coverLetter;
    private BigDecimal expectedSalary;
    private LocalDate availableDate;
}

