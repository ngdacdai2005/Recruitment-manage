package com.recruitment.service;

import com.recruitment.dto.request.CreateEmployeeRequest;
import com.recruitment.dto.request.UpdateEmployeeRequest;
import com.recruitment.dto.response.EmployeeResponse;
import com.recruitment.dto.response.PageResponse;
import com.recruitment.entity.Department;
import com.recruitment.entity.Employee;
import com.recruitment.entity.Position;
import com.recruitment.entity.Role;
import com.recruitment.entity.User;
import com.recruitment.exception.AppException;
import com.recruitment.mapper.EmployeeMapper;
import com.recruitment.repository.DepartmentRepository;
import com.recruitment.repository.EmployeeRepository;
import com.recruitment.repository.PositionRepository;
import com.recruitment.repository.RoleRepository;
import com.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.time.LocalDate;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class EmployeeService {

    private final EmployeeRepository employeeRepository;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final DepartmentRepository departmentRepository;
    private final PositionRepository positionRepository;
    private final PasswordEncoder passwordEncoder;
    private final EmployeeMapper employeeMapper;

    public PageResponse<EmployeeResponse> getEmployees(
            String keyword,
            Integer departmentId,
            Long positionId,
            Integer status,
            Pageable pageable
    ) {
        Page<Employee> page = employeeRepository.searchEmployees(
                StringUtils.hasText(keyword) ? keyword.trim() : null,
                departmentId,
                positionId,
                status,
                pageable
        );

        List<EmployeeResponse> content = page.getContent().stream()
                .map(employeeMapper::toResponse)
                .toList();

        return PageResponse.<EmployeeResponse>builder()
                .content(content)
                .pageNo(page.getNumber())
                .pageSize(page.getSize())
                .totalElements(page.getTotalElements())
                .totalPages(page.getTotalPages())
                .last(page.isLast())
                .build();
    }

    public EmployeeResponse getEmployeeById(Long id) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy nhân viên với ID: " + id, HttpStatus.NOT_FOUND));
        return employeeMapper.toResponse(employee);
    }

    public EmployeeResponse getEmployeeByUserId(Long userId) {
        Employee employee = employeeRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException("Hồ sơ nhân sự chưa được thiết lập cho tài khoản này", HttpStatus.NOT_FOUND));
        return employeeMapper.toResponse(employee);
    }

    @Transactional
    public EmployeeResponse createEmployee(CreateEmployeeRequest request, User currentUser) {
        // 1. Kiểm tra tính duy nhất của Email, Phone, CCCD
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email này đã được sử dụng trong hệ thống", HttpStatus.CONFLICT);
        }

        if (employeeRepository.existsByPhone(request.getPhone())) {
            throw new AppException("Số điện thoại này đã được sử dụng cho nhân viên khác", HttpStatus.CONFLICT);
        }

        if (StringUtils.hasText(request.getCccd()) && employeeRepository.existsByCccd(request.getCccd())) {
            throw new AppException("Số CCCD này đã tồn tại trong hệ thống", HttpStatus.CONFLICT);
        }

        // 2. Tự động sinh mã nhân viên nếu chưa truyền vào
        String employeeCode = request.getEmployeeCode();
        if (!StringUtils.hasText(employeeCode)) {
            employeeCode = generateUniqueEmployeeCode();
        } else if (employeeRepository.existsByEmployeeCode(employeeCode)) {
            throw new AppException("Mã nhân viên đã tồn tại: " + employeeCode, HttpStatus.CONFLICT);
        }

        // 3. Xác định Role của tài khoản
        String roleName = StringUtils.hasText(request.getRoleName()) ? request.getRoleName() : "ROLE_RECRUITER";
        Role role = roleRepository.findByName(roleName)
                .orElseGet(() -> roleRepository.findByName("ROLE_RECRUITER")
                        .orElseThrow(() -> new AppException("Vai trò mặc định không tồn tại", HttpStatus.INTERNAL_SERVER_ERROR)));

        // 4. Tạo tài khoản User
        String rawPassword = StringUtils.hasText(request.getPassword()) ? request.getPassword() : "password123";
        User user = User.builder()
                .email(request.getEmail().trim().toLowerCase())
                .passwordHash(passwordEncoder.encode(rawPassword))
                .fullName(request.getFullName().trim())
                .phone(request.getPhone().trim())
                .avatarUrl(request.getAvatar())
                .role(role)
                .isActive(true)
                .tokenVersion(0)
                .build();
        User savedUser = userRepository.save(user);

        // 5. Xác định Phòng ban & Chức danh
        Department department = null;
        if (request.getDepartmentId() != null) {
            department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new AppException("Không tìm thấy phòng ban với ID: " + request.getDepartmentId(), HttpStatus.NOT_FOUND));
        }

        Position position = null;
        if (request.getPositionId() != null) {
            position = positionRepository.findById(request.getPositionId())
                    .orElseThrow(() -> new AppException("Không tìm thấy vị trí chức danh với ID: " + request.getPositionId(), HttpStatus.NOT_FOUND));
        }

        // 6. Tạo hồ sơ Employee
        Employee employee = Employee.builder()
                .user(savedUser)
                .employeeCode(employeeCode)
                .shortName(request.getShortName())
                .phone(request.getPhone().trim())
                .gender(request.getGender())
                .dob(request.getDob())
                .address(request.getAddress())
                .avatar(request.getAvatar())
                .profile(request.getProfile())
                .cccd(StringUtils.hasText(request.getCccd()) ? request.getCccd().trim() : null)
                .cccdIssueDate(request.getCccdIssueDate())
                .cccdIssuePlace(request.getCccdIssuePlace())
                .bankAccount(request.getBankAccount())
                .bankName(request.getBankName())
                .joinDate(request.getJoinDate())
                .contractType(request.getContractType())
                .contractStartDate(request.getContractStartDate())
                .contractEndDate(request.getContractEndDate())
                .department(department)
                .position(position)
                .status(1)
                .isDelete(false)
                .createdBy(currentUser)
                .updatedBy(currentUser)
                .build();

        Employee savedEmployee = employeeRepository.save(employee);
        log.info("Tạo mới thành công nhân viên [{}] - Mã [{}]", savedUser.getFullName(), savedEmployee.getEmployeeCode());
        return employeeMapper.toResponse(savedEmployee);
    }

    @Transactional
    public EmployeeResponse updateEmployee(Long id, UpdateEmployeeRequest request, User currentUser) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy nhân viên với ID: " + id, HttpStatus.NOT_FOUND));

        // Kiểm tra trùng lặp CCCD nếu thay đổi
        if (StringUtils.hasText(request.getCccd()) && !request.getCccd().equals(employee.getCccd())) {
            if (employeeRepository.existsByCccd(request.getCccd())) {
                throw new AppException("Số CCCD này đã tồn tại cho nhân viên khác", HttpStatus.CONFLICT);
            }
            employee.setCccd(request.getCccd().trim());
        }

        // Cập nhật User
        User user = employee.getUser();
        user.setFullName(request.getFullName().trim());
        user.setPhone(request.getPhone().trim());
        if (StringUtils.hasText(request.getAvatar())) {
            user.setAvatarUrl(request.getAvatar());
        }
        if (request.getStatus() != null) {
            user.setIsActive(request.getStatus() == 1);
        }
        userRepository.save(user);

        // Cập nhật Employee Profile
        employee.setShortName(request.getShortName());
        employee.setPhone(request.getPhone().trim());
        employee.setGender(request.getGender());
        employee.setDob(request.getDob());
        employee.setAddress(request.getAddress());
        employee.setAvatar(request.getAvatar());
        employee.setProfile(request.getProfile());
        employee.setCccdIssueDate(request.getCccdIssueDate());
        employee.setCccdIssuePlace(request.getCccdIssuePlace());
        employee.setBankAccount(request.getBankAccount());
        employee.setBankName(request.getBankName());

        if (request.getJoinDate() != null) {
            employee.setJoinDate(request.getJoinDate());
        }
        if (request.getContractType() != null) {
            employee.setContractType(request.getContractType());
        }
        employee.setContractStartDate(request.getContractStartDate());
        employee.setContractEndDate(request.getContractEndDate());

        if (request.getDepartmentId() != null) {
            Department department = departmentRepository.findById(request.getDepartmentId())
                    .orElseThrow(() -> new AppException("Không tìm thấy phòng ban với ID: " + request.getDepartmentId(), HttpStatus.NOT_FOUND));
            employee.setDepartment(department);
        }

        if (request.getPositionId() != null) {
            Position position = positionRepository.findById(request.getPositionId())
                    .orElseThrow(() -> new AppException("Không tìm thấy vị trí với ID: " + request.getPositionId(), HttpStatus.NOT_FOUND));
            employee.setPosition(position);
        }

        if (request.getStatus() != null) {
            employee.setStatus(request.getStatus());
        }

        employee.setUpdatedBy(currentUser);
        Employee updated = employeeRepository.save(employee);
        log.info("Cập nhật thành công hồ sơ nhân viên [{}]", employee.getEmployeeCode());
        return employeeMapper.toResponse(updated);
    }

    @Transactional
    public void deleteEmployee(Long id, User currentUser) {
        Employee employee = employeeRepository.findById(id)
                .orElseThrow(() -> new AppException("Không tìm thấy nhân viên với ID: " + id, HttpStatus.NOT_FOUND));

        // Khóa tài khoản đăng nhập
        User user = employee.getUser();
        user.setIsActive(false);
        userRepository.save(user);

        // Xóa mềm hồ sơ nhân viên qua Hibernate @SQLDelete
        employeeRepository.delete(employee);
        log.info("Đã xóa mềm hồ sơ nhân viên [{}] và vô hiệu hóa tài khoản liên kết", employee.getEmployeeCode());
    }

    private String generateUniqueEmployeeCode() {
        int year = LocalDate.now().getYear();
        long count = employeeRepository.count() + 1;
        String code;
        do {
            code = String.format("EMP-%03d", count);
            count++;
        } while (employeeRepository.existsByEmployeeCode(code));
        return code;
    }
}
