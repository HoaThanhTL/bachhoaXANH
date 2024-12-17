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
                
            helper.setText(content, true); 
            
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
            
            String emailContent = String.format("""
                <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 600px; margin: 0 auto; background-color: #f9fafb;">
                    <div style="background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                        <h2 style="color: #374151; margin-bottom: 20px;">Đặt lại mật khẩu</h2>
                        
                        <p style="color: #4b5563; line-height: 1.6;">Xin chào,</p>
                        
                        <p style="color: #4b5563; line-height: 1.6;">
                            Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng click vào nút bên dưới để đặt lại mật khẩu:
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="%s" 
                               style="background-color: #4f46e5; 
                                      color: white; 
                                      padding: 12px 24px; 
                                      text-decoration: none; 
                                      border-radius: 6px;
                                      font-weight: bold;
                                      display: inline-block;">
                                Đặt lại mật khẩu
                            </a>
                        </div>
                        
                        <p style="color: #4b5563; line-height: 1.6;">
                            Link này sẽ hết hạn sau 30 phút.
                        </p>
                        
                        <p style="color: #4b5563; line-height: 1.6;">
                            Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.
                        </p>
                        
                        <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                        
                        <p style="color: #6b7280; font-size: 14px; text-align: center;">
                            Email này được gửi tự động từ hệ thống Orebi. Vui lòng không trả lời email này.
                        </p>
                    </div>
                </div>
                """, resetLink);
                
            helper.setText(emailContent, true); // true để gửi dưới dạng HTML
            
            mailSender.send(message);
        } catch (Exception e) {
            throw new RuntimeException("Không thể gửi email: " + e.getMessage());
        }
    }
}
