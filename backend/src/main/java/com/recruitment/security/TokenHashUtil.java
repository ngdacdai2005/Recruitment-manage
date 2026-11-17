package com.recruitment.security;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;

/**
 * Utility băm SHA-256 an toàn cho Refresh Token trước khi lưu vào Database
 */
public class TokenHashUtil {

    private TokenHashUtil() {
        // Private constructor for utility class
    }

    public static String hashToken(String token) {
        if (token == null || token.isBlank()) {
            return null;
        }
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] encodedHash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder(2 * encodedHash.length);
            for (byte b : encodedHash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException("Lỗi khởi tạo thuật toán SHA-256", e);
        }
    }

    public static boolean matches(String rawToken, String hashedToken) {
        if (rawToken == null || hashedToken == null) {
            return false;
        }
        String newHash = hashToken(rawToken);
        return MessageDigest.isEqual(newHash.getBytes(StandardCharsets.UTF_8), hashedToken.getBytes(StandardCharsets.UTF_8));
    }
}
