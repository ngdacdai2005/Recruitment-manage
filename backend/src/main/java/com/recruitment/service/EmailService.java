package com.recruitment.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

/**
 * Service gửi email thông báo và mã xác thực đặt lại mật khẩu
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class EmailService {

    @Autowired(required = false)
    private JavaMailSender mailSender;

    public void sendPasswordResetEmail(String toEmail, String resetToken) {
        String resetUrl = "http://localhost:5173/reset-password?token=" + resetToken;
        log.info("================================================================================");
        log.info("🔑 GỬI EMAIL ĐẶT LẠI MẬT KHẨU CHO: {}", toEmail);
        log.info("🔑 Mã Reset Token: {}", resetToken);
        log.info("🔑 Đường dẫn đặt lại mật khẩu: {}", resetUrl);
        log.info("================================================================================");

        if (mailSender != null) {
            try {
                SimpleMailMessage message = new SimpleMailMessage();
                message.setTo(toEmail);
                message.setSubject("[Recruitment System] Yêu cầu đặt lại mật khẩu");
                message.setText("Xin chào,\n\nBạn vừa gửi yêu cầu đặt lại mật khẩu tài khoản tuyển dụng.\n"
                        + "Vui lòng truy cập liên kết sau (có hiệu lực trong vòng 15 phút):\n"
                        + resetUrl + "\n\n"
                        + "Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email để đảm bảo an toàn.\n\n"
                        + "Trân trọng,\nĐội ngũ Tuyển dụng RMS.");
                mailSender.send(message);
                log.info("Đã gửi email khôi phục mật khẩu thành công tới {}", toEmail);
            } catch (Exception e) {
                log.warn("Chưa thể kết nối tới SMTP Mail Server, thông tin reset link đã được in ra logger: {}", e.getMessage());
            }
        }
    }
}
