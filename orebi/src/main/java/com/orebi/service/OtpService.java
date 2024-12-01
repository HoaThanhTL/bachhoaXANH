package com.orebi.service;

import java.time.LocalDateTime;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.orebi.entity.User;
import com.orebi.exception.InvalidOtpException;
import com.orebi.exception.ResourceNotFoundException;
import com.orebi.repository.UserRepository;

@Service
public class OtpService {
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private JavaMailSender mailSender;

    public void generateAndSendOtp(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        // Tạo OTP ngẫu nhiên 6 số
        String otp = String.format("%06d", new Random().nextInt(999999));
        
        // Lưu OTP và thời gian hết hạn (5 phút)
        user.setOtp(otp);
        user.setOtpExpiredAt(LocalDateTime.now().plusMinutes(5));
        user.setOtpVerified(false);
        userRepository.save(user);

        // Gửi OTP qua email
        SimpleMailMessage message = new SimpleMailMessage();
        message.setTo(email);
        message.setSubject("Mã OTP xác thực");
        message.setText("Mã OTP của bạn là: " + otp + "\nMã có hiệu lực trong 5 phút.");
        mailSender.send(message);
    }

    public boolean verifyOtp(String email, String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("Không tìm thấy người dùng"));

        if (user.getOtp().equals(otp)) {
            if (LocalDateTime.now().isBefore(user.getOtpExpiredAt())) {
                user.setOtpVerified(true);
                user.setOtp(null);
                user.setOtpExpiredAt(null);
                userRepository.save(user);
                return true;
            } else {
                throw new InvalidOtpException("OTP đã hết hạn");
            }
        }
        return false;
    }
}
