package com.recruitment.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class PositionResponse {
    private Long id;
    private String name;
    private String code;
    private String description;
    private Integer departmentId;
    private String departmentName;
    private Boolean isActive;
    private LocalDateTime createdAt;
}
