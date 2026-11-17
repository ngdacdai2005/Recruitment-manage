package com.recruitment.repository;

import com.recruitment.entity.Employee;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface EmployeeRepository extends JpaRepository<Employee, Long> {

    Optional<Employee> findByUserId(Long userId);

    Optional<Employee> findByEmployeeCode(String employeeCode);

    boolean existsByEmployeeCode(String employeeCode);

    boolean existsByPhone(String phone);

    boolean existsByCccd(String cccd);

    @Query("SELECT e FROM Employee e WHERE " +
           "(:keyword IS NULL OR LOWER(e.employeeCode) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(e.user.fullName) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(e.phone) LIKE LOWER(CONCAT('%', :keyword, '%')) " +
           "OR LOWER(e.user.email) LIKE LOWER(CONCAT('%', :keyword, '%'))) " +
           "AND (:departmentId IS NULL OR e.department.id = :departmentId) " +
           "AND (:positionId IS NULL OR e.position.id = :positionId) " +
           "AND (:status IS NULL OR e.status = :status)")
    Page<Employee> searchEmployees(
            @Param("keyword") String keyword,
            @Param("departmentId") Integer departmentId,
            @Param("positionId") Long positionId,
            @Param("status") Integer status,
            Pageable pageable
    );

    long countByStatus(Integer status);
}
