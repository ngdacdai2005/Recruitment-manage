package com.recruitment.mapper;

import com.recruitment.dto.response.AuthResponse;
import com.recruitment.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public AuthResponse toAuthResponse(User user, String accessToken, String refreshToken) {
        if (user == null) return null;
        return AuthResponse.builder()
                .accessToken(accessToken)
                .refreshToken(refreshToken)
                .userId(user.getId())
                .email(user.getEmail())
                .fullName(user.getFullName())
                .role(user.getRole() != null ? user.getRole().getName() : null)
                .build();
    }
}

