package com.recruitment.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ScheduleInterviewRequest {
    @NotNull(message = "Mã đơn ứng tuyển không được để trống")
    private Long applicationId;

    @NotNull(message = "Mã người phỏng vấn không được để trống")
    private Long interviewerId;

    @NotNull(message = "Thời gian phỏng vấn không được để trống")
    private LocalDateTime scheduledAt;

    @Builder.Default
    private Integer durationMinutes = 60;

    @Builder.Default
    private String interviewType = "ONLINE";

    private String locationOrLink;
    private String notes;
}

