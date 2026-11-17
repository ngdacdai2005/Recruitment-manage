package com.recruitment.security;

import com.recruitment.entity.User;
import com.recruitment.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Service quản lý trạng thái Token:
 * - Đưa JTI Access Token vào Redis Blacklist khi logout.
 * - Kiểm tra token có nằm trong Blacklist hay không.
 * - Revoke toàn bộ phiên đăng nhập bằng cách tăng token_version.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class TokenStateService {

    private static final String BLACKLIST_KEY_PREFIX = "token:blacklist:";

    private final StringRedisTemplate stringRedisTemplate;
    private final UserRepository userRepository;

    // Fallback bộ nhớ đệm nội bộ phòng trường hợp Redis server không khả dụng trong local dev
    private final Map<String, Long> localBlacklistFallback = new ConcurrentHashMap<>();

    /**
     * Đưa JTI của Access Token vào Blacklist với thời hạn tồn tại (TTL)
     */
    public void blacklistAccessToken(String jti, long remainingMs) {
        if (jti == null || remainingMs <= 0) {
            return;
        }

        try {
            String redisKey = BLACKLIST_KEY_PREFIX + jti;
            stringRedisTemplate.opsForValue().set(redisKey, "revoked", Duration.ofMillis(remainingMs));
            log.info("Đã đưa JTI [{}] vào Redis Blacklist với TTL: {} ms", jti, remainingMs);
        } catch (Exception e) {
            log.warn("Không thể kết nối tới Redis, lưu JTI [{}] vào bộ nhớ tạm in-memory: {}", jti, e.getMessage());
            localBlacklistFallback.put(jti, System.currentTimeMillis() + remainingMs);
        }
    }

    /**
     * Kiểm tra xem JTI có bị Blacklist (đã logout) hay chưa
     */
    public boolean isTokenBlacklisted(String jti) {
        if (jti == null) {
            return false;
        }

        try {
            String redisKey = BLACKLIST_KEY_PREFIX + jti;
            Boolean hasKey = stringRedisTemplate.hasKey(redisKey);
            if (Boolean.TRUE.equals(hasKey)) {
                return true;
            }
        } catch (Exception e) {
            log.debug("Redis không khả dụng khi kiểm tra blacklist, fallback sang in-memory: {}", e.getMessage());
        }

        Long expiry = localBlacklistFallback.get(jti);
        if (expiry != null) {
            if (System.currentTimeMillis() < expiry) {
                return true;
            } else {
                localBlacklistFallback.remove(jti);
            }
        }

        return false;
    }

    /**
     * Revoke tất cả các phiên làm việc của User bằng cách tăng token_version
     */
    @Transactional
    public void revokeAllUserSessions(Long userId) {
        userRepository.findById(userId).ifPresent(user -> {
            int currentVersion = user.getTokenVersion() != null ? user.getTokenVersion() : 0;
            user.setTokenVersion(currentVersion + 1);
            user.setRefreshTokenHash(null);
            userRepository.save(user);
            log.info("Đã revoke tất cả phiên của User ID [{}], token_version mới: {}", userId, user.getTokenVersion());
        });
    }

    /**
     * Kiểm tra token_version của token có khớp với phiên hiện tại trong DB hay không
     */
    public boolean isTokenVersionValid(User user, Integer tokenVersionInClaim) {
        if (user == null) {
            return false;
        }
        int currentVersion = user.getTokenVersion() != null ? user.getTokenVersion() : 0;
        int claimVersion = tokenVersionInClaim != null ? tokenVersionInClaim : 0;
        return currentVersion == claimVersion;
    }
}
