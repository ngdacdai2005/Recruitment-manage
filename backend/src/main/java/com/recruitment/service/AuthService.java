package com.recruitment.service;

import com.recruitment.dto.request.ForgotPasswordRequest;
import com.recruitment.dto.request.LoginRequest;
import com.recruitment.dto.request.RegisterRequest;
import com.recruitment.dto.request.ResetPasswordRequest;
import com.recruitment.dto.response.AuthResponse;
import com.recruitment.entity.Candidate;
import com.recruitment.entity.Role;
import com.recruitment.entity.User;
import com.recruitment.exception.AppException;
import com.recruitment.repository.CandidateRepository;
import com.recruitment.repository.RoleRepository;
import com.recruitment.repository.UserRepository;
import com.recruitment.security.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * Service xử lý toàn bộ logic Authentication:
 * - Đăng nhập, Đăng ký
 * - Cấp phát & xoay vòng Refresh Token (Token Rotation) với Cookie HttpOnly
 * - Logout & Đưa Access Token JTI vào Redis Blacklist
 * - Quên mật khẩu & Đặt lại mật khẩu (Revoke tất cả session)
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CandidateRepository candidateRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenService jwtTokenService;
    private final TokenStateService tokenStateService;
    private final EmailService emailService;

    /**
     * POST /login: Kiểm tra password -> revoke session cũ -> tạo Access + Refresh Token
     * -> lưu hash Refresh Token vào DB -> trả Cookie HttpOnly.
     */
    @Transactional
    public AuthResponse login(LoginRequest request, HttpServletResponse response) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userPrincipal.getUsername())
                .orElseThrow(() -> new AppException("Tài khoản người dùng không tồn tại", HttpStatus.NOT_FOUND));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new AppException("Tài khoản của bạn đã bị khóa", HttpStatus.FORBIDDEN);
        }

        // Tạo Access Token và Refresh Token có gắn kèm tokenVersion hiện tại
        int tokenVersion = user.getTokenVersion() != null ? user.getTokenVersion() : 0;
        String role = userPrincipal.getAuthorities().iterator().next().getAuthority();

        String accessToken = jwtTokenService.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                role,
                tokenVersion
        );
        String refreshToken = jwtTokenService.generateRefreshToken(user.getId(), user.getEmail(), tokenVersion);

        // Băm SHA-256 Refresh Token và lưu vào DB (revoke refresh token cũ)
        String hashedRefreshToken = TokenHashUtil.hashToken(refreshToken);
        user.setRefreshTokenHash(hashedRefreshToken);
        userRepository.save(user);

        // Thiết lập Cookie HttpOnly cho Refresh Token (thời hạn 7 ngày)
        long refreshExpirySeconds = jwtTokenService.getRefreshExpirationMs() / 1000;
        CookieUtil.addRefreshTokenCookie(response, refreshToken, refreshExpirySeconds);

        return AuthResponse.builder()
                .accessToken(accessToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(role)
                .build();
    }

    /**
     * POST /refresh: Đọc cookie -> verify signature & token_version -> so khớp hash SHA-256 -> cấp session mới.
     */
    @Transactional
    public AuthResponse refresh(HttpServletRequest request, HttpServletResponse response) {
        String refreshToken = CookieUtil.getRefreshTokenFromCookie(request);

        if (refreshToken == null || !jwtTokenService.validateToken(refreshToken)) {
            throw new AppException("Refresh token không hợp lệ hoặc đã hết hạn", HttpStatus.UNAUTHORIZED);
        }

        String email = jwtTokenService.getEmailFromToken(refreshToken);
        Integer tokenVersionInToken = jwtTokenService.getTokenVersionFromToken(refreshToken);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new AppException("Tài khoản không tồn tại", HttpStatus.UNAUTHORIZED));

        if (Boolean.FALSE.equals(user.getIsActive())) {
            throw new AppException("Tài khoản đã bị khóa", HttpStatus.FORBIDDEN);
        }

        // 1. Kiểm tra token_version (nếu version không khớp chứng tỏ session cũ đã bị revoke)
        if (!tokenStateService.isTokenVersionValid(user, tokenVersionInToken)) {
            throw new AppException("Phiên đăng nhập đã bị hủy trên thiết bị khác, vui lòng đăng nhập lại", HttpStatus.UNAUTHORIZED);
        }

        // 2. So khớp mã băm SHA-256 của Refresh Token với mã lưu trong DB
        if (!TokenHashUtil.matches(refreshToken, user.getRefreshTokenHash())) {
            log.warn("Phát hiện Refresh Token giả mạo hoặc đã bị thay thế cho User [{}]", email);
            throw new AppException("Refresh Token không hợp lệ hoặc đã bị thu hồi", HttpStatus.UNAUTHORIZED);
        }

        // 3. Cấp phiên mới (Refresh Token Rotation): Sinh Access & Refresh Token mới
        int currentVersion = user.getTokenVersion() != null ? user.getTokenVersion() : 0;
        String role = user.getRole().getName();

        String newAccessToken = jwtTokenService.generateAccessToken(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                role,
                currentVersion
        );
        String newRefreshToken = jwtTokenService.generateRefreshToken(user.getId(), user.getEmail(), currentVersion);

        // 4. Lưu hash của Refresh Token mới vào DB
        user.setRefreshTokenHash(TokenHashUtil.hashToken(newRefreshToken));
        userRepository.save(user);

        // 5. Cập nhật lại Cookie HttpOnly mới
        long refreshExpirySeconds = jwtTokenService.getRefreshExpirationMs() / 1000;
        CookieUtil.addRefreshTokenCookie(response, newRefreshToken, refreshExpirySeconds);

        return AuthResponse.builder()
                .accessToken(newAccessToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(role)
                .build();
    }

    /**
     * POST /logout: Đưa access JTI vào Redis blacklist -> set refresh_token = null -> clear cookie.
     */
    @Transactional
    public void logout(String authHeader, HttpServletRequest request, HttpServletResponse response) {
        // 1. Đưa JTI của Access Token hiện tại vào Redis Blacklist
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String accessToken = authHeader.substring(7);
            if (jwtTokenService.validateToken(accessToken)) {
                String jti = jwtTokenService.getJtiFromToken(accessToken);
                long remainingMs = jwtTokenService.getRemainingExpirationMs(accessToken);
                tokenStateService.blacklistAccessToken(jti, remainingMs);
            }
        }

        // 2. Thu hồi Refresh Token trong DB nếu đọc được từ cookie
        String refreshToken = CookieUtil.getRefreshTokenFromCookie(request);
        if (refreshToken != null) {
            try {
                if (jwtTokenService.validateToken(refreshToken)) {
                    String email = jwtTokenService.getEmailFromToken(refreshToken);
                    userRepository.findByEmail(email).ifPresent(user -> {
                        user.setRefreshTokenHash(null);
                        userRepository.save(user);
                    });
                }
            } catch (Exception e) {
                log.debug("Bỏ qua lỗi trích xuất refresh token khi logout: {}", e.getMessage());
            }
        }

        // 3. Xóa Cookie HttpOnly
        CookieUtil.deleteRefreshTokenCookie(response);
    }

    /**
     * POST /forgot-password: Tạo reset token và gửi mail
     */
    @Transactional
    public void forgotPassword(ForgotPasswordRequest request) {
        userRepository.findByEmail(request.getEmail()).ifPresent(user -> {
            String resetToken = UUID.randomUUID().toString();
            user.setResetPasswordToken(resetToken);
            user.setResetPasswordExpiry(LocalDateTime.now().plusMinutes(15)); // Hết hạn sau 15 phút
            userRepository.save(user);

            emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
        });
    }

    /**
     * POST /reset-password: Xác thực token, cập nhật mật khẩu, tăng token_version để hủy toàn bộ session cũ
     */
    @Transactional
    public void resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByResetPasswordToken(request.getToken())
                .orElseThrow(() -> new AppException("Mã đặt lại mật khẩu không hợp lệ", HttpStatus.BAD_REQUEST));

        if (user.getResetPasswordExpiry() == null || user.getResetPasswordExpiry().isBefore(LocalDateTime.now())) {
            throw new AppException("Mã đặt lại mật khẩu đã hết hạn", HttpStatus.BAD_REQUEST);
        }

        // Đổi mật khẩu
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        user.setResetPasswordToken(null);
        user.setResetPasswordExpiry(null);
        user.setRefreshTokenHash(null);

        // Tăng token_version để đăng xuất khỏi TẤT CẢ các thiết bị đang đăng nhập
        int currentVersion = user.getTokenVersion() != null ? user.getTokenVersion() : 0;
        user.setTokenVersion(currentVersion + 1);

        userRepository.save(user);
        log.info("Đặt lại mật khẩu thành công cho User [{}] và đã vô hiệu hóa mọi phiên đăng nhập cũ", user.getEmail());
    }

    /**
     * Đăng ký tài khoản ứng viên mới
     */
    @Transactional
    public AuthResponse register(RegisterRequest request, HttpServletResponse response) {
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
                .tokenVersion(0)
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

        // Tự động đăng nhập
        return login(LoginRequest.builder()
                .email(request.getEmail())
                .password(request.getPassword())
                .build(), response);
    }
}
