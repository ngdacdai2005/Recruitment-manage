package com.recruitment.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EvaluationRequest {
    @Min(1) @Max(10)
    private Integer technicalScore;

    @Min(1) @Max(10)
    private Integer communicationScore;

    @Min(1) @Max(10)
    private Integer problemSolvingScore;

    @Min(1) @Max(10)
    private Integer teamworkScore;

    private String generalNotes;

    @NotBlank(message = "Kết luận không được để trống")
    @Builder.Default
    private String result = "PASS"; // PASS, FAIL, PENDING
}

