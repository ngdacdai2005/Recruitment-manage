package com.recruitment.security;

import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

/**
 * Lớp tương thích ngược (Backward compatibility) ủy quyền logic cho JwtTokenService
 */
@Component
@RequiredArgsConstructor
public class JwtTokenProvider {

    private final JwtTokenService jwtTokenService;

    public String generateAccessToken(Authentication authentication) {
        CustomUserDetails userPrincipal = (CustomUserDetails) authentication.getPrincipal();
        String role = userPrincipal.getAuthorities().iterator().next().getAuthority();
        return jwtTokenService.generateAccessToken(
                userPrincipal.getId(),
                userPrincipal.getUsername(),
                userPrincipal.getFullName(),
                role,
                0
        );
    }

    public String generateRefreshToken(String email) {
        return jwtTokenService.generateRefreshToken(null, email, 0);
    }

    public String getEmailFromToken(String token) {
        return jwtTokenService.getEmailFromToken(token);
    }

    public boolean validateToken(String token) {
        return jwtTokenService.validateToken(token);
    }
}
