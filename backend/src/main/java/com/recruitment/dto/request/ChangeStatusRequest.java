package com.recruitment.dto.request;

import com.recruitment.entity.enums.ApplicationStatus;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ChangeStatusRequest {
    @NotNull(message = "Trạng thái mới không được để trống")
    private ApplicationStatus toStatus;

    private String note;
    private String rejectionReason;
}

