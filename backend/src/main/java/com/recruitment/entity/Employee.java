package com.recruitment.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.recruitment.entity.enums.ContractType;
import com.recruitment.entity.enums.Gender;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.annotations.SQLDelete;
import org.hibernate.annotations.SQLRestriction;
import org.hibernate.type.SqlTypes;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;
import java.time.LocalDateTime;

/**
 * Hồ sơ nhân sự nhân viên (Employee Profile)
 * Quản lý tập trung toàn bộ nghiệp vụ nhân sự, pháp lý, ngân hàng, hợp đồng lao động
 */
@Entity
@Table(name = "employees")
@EntityListeners(AuditingEntityListener.class)
@SQLDelete(sql = "UPDATE employees SET is_delete = true WHERE id = ?")
@SQLRestriction("is_delete = false")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Employee {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", unique = true, nullable = false)
    private User user;

    @Column(name = "employee_code", unique = true, nullable = false, length = 20)
    private String employeeCode;

    @Column(name = "short_name", length = 50)
    private String shortName;

    @Column(nullable = false, length = 20)
    private String phone;

    @Enumerated(EnumType.ORDINAL)
    @JdbcTypeCode(SqlTypes.INTEGER)
    @Column(nullable = false)
    private Gender gender; // 0: FEMALE, 1: MALE, 2: OTHER

    private LocalDate dob;

    @Column(columnDefinition = "TEXT")
    private String address;

    @Column(length = 500)
    private String avatar;

    @Column(columnDefinition = "TEXT")
    private String profile;

    @Column(length = 12, unique = true)
    private String cccd;

    @Column(name = "cccd_issue_date")
    private LocalDate cccdIssueDate;

    @Column(name = "cccd_issue_place", length = 255)
    private String cccdIssuePlace;

    @Column(name = "bank_account", length = 50)
    private String bankAccount;

    @Column(name = "bank_name", length = 100)
    private String bankName;

    @Column(name = "join_date", nullable = false)
    private LocalDate joinDate;

    @Enumerated(EnumType.STRING)
    @Column(name = "contract_type", nullable = false, length = 20)
    private ContractType contractType; // OFFICIAL, PROBATION, PART_TIME, INTERN

    @Column(name = "contract_start_date")
    private LocalDate contractStartDate;

    @Column(name = "contract_end_date")
    private LocalDate contractEndDate;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "department_id")
    private Department department;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "position_id")
    private Position position;

    @Builder.Default
    @Column(nullable = false)
    private Integer status = 1; // 1: ACTIVE, 0: INACTIVE

    @Builder.Default
    @Column(name = "is_delete", nullable = false)
    private Boolean isDelete = false;

    @CreatedDate
    @Column(name = "created_at", updatable = false)
    private LocalDateTime createdAt;

    @LastModifiedDate
    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by")
    private User createdBy;

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "updated_by")
    private User updatedBy;
}
