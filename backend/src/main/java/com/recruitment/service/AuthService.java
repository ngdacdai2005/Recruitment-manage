package com.recruitment.service;

import com.recruitment.dto.request.LoginRequest;
import com.recruitment.dto.request.RegisterRequest;
import com.recruitment.dto.response.AuthResponse;
import com.recruitment.entity.Candidate;
import com.recruitment.entity.Role;
import com.recruitment.entity.User;
import com.recruitment.exception.AppException;
import com.recruitment.repository.CandidateRepository;
import com.recruitment.repository.RoleRepository;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.CustomUserDetails;
import com.recruitment.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CandidateRepository candidateRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        String accessToken = tokenProvider.generateAccessToken(authentication);
        String refreshToken = tokenProvider.generateRefreshToken(userPrincipal.getUsername());
        String role = userPrincipal.getAuthorities().iterator().next().getAuthority();

        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(userPrincipal.getId())
                .email(userPrincipal.getUsername())
                .fullName(userPrincipal.getFullName())
                .role(role)
                .build();
    }

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new AppException("Email này đã được sử dụng trong hệ thống", HttpStatus.CONFLICT);
        }

        Role candidateRole = roleRepository.findByName("ROLE_CANDIDATE")
                .orElseThrow(() -> new AppException("Cấu hình vai trò mặc định không tồn tại", HttpStatus.INTERNAL_SERVER_ERROR));

        User user = User.builder()
                .email(request.getEmail())
                .passwordHash(passwordEncoder.encode(request.getPassword()))
                .fullName(request.getFullName())
                .phone(request.getPhone())
                .role(candidateRole)
                .isActive(true)
                .build();

        User savedUser = userRepository.save(user);

        // Khởi tạo hồ sơ Candidate Profile tự động
        Candidate candidate = Candidate.builder()
                .user(savedUser)
                .fullName(savedUser.getFullName())
                .email(savedUser.getEmail())
                .phone(savedUser.getPhone())
                .build();
        candidateRepository.save(candidate);

        // Đăng nhập tự động sau khi đăng ký
        return login(LoginRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build());
    }
}

