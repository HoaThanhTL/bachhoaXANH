package com.orebi.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orebi.dto.LoginDTO;
import com.orebi.dto.MessageResponse;
import com.orebi.dto.RegisterDTO;
import com.orebi.entity.User;
import com.orebi.service.OtpService;
import com.orebi.service.UserService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @PostMapping("/register")
    public ResponseEntity<User> register(@RequestBody RegisterDTO registerDTO) {
        User newUser = userService.registerUser(registerDTO);
        return ResponseEntity.ok(newUser);
    }

    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginDTO loginDTO) {
        String token = userService.loginUser(loginDTO);
        return ResponseEntity.ok(token);
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestBody String email) {
        userService.sendPasswordResetEmail(email);
        return ResponseEntity.ok("Password reset email sent.");
    }

    @PostMapping("/send-otp")
    public ResponseEntity<?> sendOtp(@RequestBody Map<String, String> request) {
        try {
            otpService.generateAndSendOtp(request.get("email"));
            return ResponseEntity.ok(new MessageResponse("OTP đã được gửi"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Lỗi khi gửi OTP: " + e.getMessage()));
        }
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOtp(@RequestBody Map<String, String> request) {
        try {
            boolean isValid = otpService.verifyOtp(
                request.get("email"), 
                request.get("otp")
            );
            if (isValid) {
                return ResponseEntity.ok(new MessageResponse("Xác thực OTP thành công"));
            } else {
                return ResponseEntity.badRequest()
                    .body(new MessageResponse("OTP không chính xác"));
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Lỗi khi xác thực OTP: " + e.getMessage()));
        }
    }
}