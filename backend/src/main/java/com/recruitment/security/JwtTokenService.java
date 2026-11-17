package com.recruitment.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.UUID;

/**
 * Service quản lý sinh và giải mã JWT Token (Access & Refresh Token)
 */
@Slf4j
@Getter
@Service
public class JwtTokenService {

    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration-ms}")
    private long jwtExpirationMs;

    @Value("${app.jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(this.jwtSecret);
        return Keys.hmacShaKeyFor(keyBytes);
    }

    /**
     * Sinh Access Token chứa jti, userId, email, role, tokenVersion
     */
    public String generateAccessToken(Long userId, String email, String fullName, String role, Integer tokenVersion) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpirationMs);
        String jti = UUID.randomUUID().toString();

        return Jwts.builder()
                .id(jti)
                .subject(email)
                .claim("id", userId)
                .claim("fullName", fullName)
                .claim("role", role)
                .claim("tokenVersion", tokenVersion != null ? tokenVersion : 0)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    /**
     * Sinh Refresh Token chứa jti, userId, tokenVersion
     */
    public String generateRefreshToken(Long userId, String email, Integer tokenVersion) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + refreshExpirationMs);
        String jti = UUID.randomUUID().toString();

        return Jwts.builder()
                .id(jti)
                .subject(email)
                .claim("id", userId)
                .claim("tokenVersion", tokenVersion != null ? tokenVersion : 0)
                .issuedAt(now)
                .expiration(expiryDate)
                .signWith(getSigningKey())
                .compact();
    }

    public Claims extractAllClaims(String token) {
        return Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String getEmailFromToken(String token) {
        return extractAllClaims(token).getSubject();
    }

    public Long getUserIdFromToken(String token) {
        Object idClaim = extractAllClaims(token).get("id");
        if (idClaim instanceof Number number) {
            return number.longValue();
        } else if (idClaim != null) {
            return Long.parseLong(idClaim.toString());
        }
        return null;
    }

    public String getRoleFromToken(String token) {
        return extractAllClaims(token).get("role", String.class);
    }

    public String getJtiFromToken(String token) {
        Claims claims = extractAllClaims(token);
        String jti = claims.getId();
        if (jti == null) {
            jti = claims.get("jti", String.class);
        }
        return jti;
    }

    public Integer getTokenVersionFromToken(String token) {
        Object tv = extractAllClaims(token).get("tokenVersion");
        if (tv instanceof Number number) {
            return number.intValue();
        } else if (tv != null) {
            return Integer.parseInt(tv.toString());
        }
        return 0;
    }

    public long getRemainingExpirationMs(String token) {
        try {
            Date expiration = extractAllClaims(token).getExpiration();
            long remaining = expiration.getTime() - System.currentTimeMillis();
            return Math.max(remaining, 0);
        } catch (Exception e) {
            return 0;
        }
    }

    public boolean validateToken(String token) {
        try {
            Jwts.parser().verifyWith(getSigningKey()).build().parseSignedClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            log.error("JWT Token không hợp lệ hoặc đã hết hạn: {}", ex.getMessage());
        }
        return false;
    }
}
