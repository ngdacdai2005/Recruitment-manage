package com.recruitment.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filter xác thực JWT cho mọi Request:
 * 1. Trích xuất Bearer token từ Authorization header.
 * 2. Xác thực chữ ký và thời hạn token.
 * 3. Kiểm tra JTI có nằm trong Redis Blacklist không.
 * 4. Kiểm tra token_version có khớp với phiên tài khoản hiện tại không.
 */
@Slf4j
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenService jwtTokenService;
    private final TokenStateService tokenStateService;
    private final CustomUserDetailsService customUserDetailsService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest request,
            @NonNull HttpServletResponse response,
            @NonNull FilterChain filterChain
    ) throws ServletException, IOException {
        try {
            String jwt = getJwtFromRequest(request);

            if (StringUtils.hasText(jwt) && jwtTokenService.validateToken(jwt)) {
                // 1. Kiểm tra JTI trong Redis Blacklist (Đã logout)
                String jti = jwtTokenService.getJtiFromToken(jwt);
                if (tokenStateService.isTokenBlacklisted(jti)) {
                    log.warn("Access Token có JTI [{}] đã bị đưa vào Blacklist (Đã đăng xuất)", jti);
                    filterChain.doFilter(request, response);
                    return;
                }

                String email = jwtTokenService.getEmailFromToken(jwt);
                CustomUserDetails userDetails = (CustomUserDetails) customUserDetailsService.loadUserByUsername(email);

                // 2. Kiểm tra token_version (Đã bị revoke toàn bộ phiên khi đổi pass hoặc reset pass)
                Integer tokenVersionInToken = jwtTokenService.getTokenVersionFromToken(jwt);
                if (!tokenVersionInToken.equals(userDetails.getTokenVersion())) {
                    log.warn("Token version của token [{}] không khớp với DB [{}] cho User [{}]",
                            tokenVersionInToken, userDetails.getTokenVersion(), email);
                    filterChain.doFilter(request, response);
                    return;
                }

                // 3. Thiết lập thông tin xác thực vào Security Context
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception ex) {
            log.error("Không thể thiết lập xác thực trong SecurityContext: {}", ex.getMessage());
        }

        filterChain.doFilter(request, response);
    }

    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7);
        }
        return null;
    }
}
