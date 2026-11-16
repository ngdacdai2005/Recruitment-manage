package com.recruitment.service;

import com.recruitment.entity.Role;
import com.recruitment.entity.User;
import com.recruitment.exception.AppException;
import com.recruitment.repository.RoleRepository;
import com.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional
    public User updateUserRole(Long userId, String roleName) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Người dùng không tồn tại", HttpStatus.NOT_FOUND));

        Role role = roleRepository.findByName(roleName)
                .orElseThrow(() -> new AppException("Vai trò không tồn tại", HttpStatus.BAD_REQUEST));

        user.setRole(role);
        return userRepository.save(user);
    }

    @Transactional
    public User toggleUserActive(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException("Người dùng không tồn tại", HttpStatus.NOT_FOUND));

        user.setIsActive(!Boolean.TRUE.equals(user.getIsActive()));
        return userRepository.save(user);
    }
}

