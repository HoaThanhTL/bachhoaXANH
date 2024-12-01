package com.orebi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.internet.MimeMessage;

@Service
public class EmailService {
    @Autowired
    private JavaMailSender mailSender;
    
    @Value("${mail.sender.name}")
    private String senderName;
    
    @Value("${mail.sender.email}")
    private String senderEmail;

    public void sendVerificationEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            
            helper.setFrom(senderEmail, senderName);
            helper.setTo(toEmail);
            helper.setSubject("Xác thực tài khoản Orebi");
            
            String content = String.format("""
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <h2>Xác thực tài khoản Orebi</h2>
                    <p>Xin chào,</p>
                    <p>Mã OTP của bạn là: <strong>%s</strong></p>
                    <p>Mã có hiệu lực trong 5 phút.</p>
                    <p>Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email này.</p>
                    <br>
                    <p>Trân trọng,<br>Đội ngũ Orebi</p>
                </div>
                """, otp);
                
            helper.setText(content, true); // true để gửi dưới dạng HTML
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Error sending email: " + e.getMessage());
        }
    }

    public void sendPasswordResetEmail(String toEmail, String resetLink) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true);
            
            helper.setFrom(senderEmail);
            helper.setTo(toEmail);
            helper.setSubject("Đặt lại mật khẩu");
            
            String emailContent = String.format(
                "Xin chào,<br><br>" +
                "Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào link bên dưới để đặt lại mật khẩu:<br><br>" +
                "<a href='%s'>Đặt lại mật khẩu</a><br><br>" +
                "Link này sẽ hết hạn sau 30 phút.<br><br>" +
                "Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.",
                resetLink
            );
            
            helper.setText(emailContent, true);
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }
}
