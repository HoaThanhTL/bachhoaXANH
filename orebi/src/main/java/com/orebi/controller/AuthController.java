package com.orebi.controller;

import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CookieValue;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.orebi.dto.LoginDTO;
import com.orebi.dto.RegisterDTO;
import com.orebi.dto.request.ForgotPasswordRequest;
import com.orebi.dto.request.ResetPasswordRequest;
import com.orebi.dto.response.MessageResponse;
import com.orebi.dto.response.TokenResponse;
import com.orebi.entity.User;
import com.orebi.security.JwtTokenUtil;
import com.orebi.service.EmailService;
import com.orebi.service.OtpService;
import com.orebi.service.RefreshTokenService;
import com.orebi.service.UserService;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private OtpService otpService;

    @Autowired
    private EmailService emailService;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private RefreshTokenService refreshTokenService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterDTO registerDTO) {
        return userService.registerUser(registerDTO);
    }

    @PostMapping("/verify")
    public ResponseEntity<?> verifyAccount(@RequestParam String email, @RequestParam String otp) {
        return userService.verifyAccount(email, otp);
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginDTO loginDTO, HttpServletResponse response) {
        try {
            User user = userService.authenticate(loginDTO.getEmail(), loginDTO.getPassword());
            
            String accessToken = jwtTokenUtil.generateAccessToken(user.getEmail());
            String refreshToken = jwtTokenUtil.generateRefreshToken(user.getEmail());

            Cookie cookie = new Cookie("refreshToken", refreshToken);
            cookie.setMaxAge(7 * 24 * 60 * 60);
            cookie.setHttpOnly(true);
            cookie.setSecure(true);
            cookie.setPath("/");
            response.addCookie(cookie);

            return ResponseEntity.ok(new TokenResponse(accessToken));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Đăng nhập thất bại: " + e.getMessage()));
        }
    }

    @PostMapping("/forgot-password")
    public ResponseEntity<?> forgotPassword(@RequestBody ForgotPasswordRequest request) {
        try {
            userService.sendPasswordResetEmail(request.getEmail());
            return ResponseEntity.ok(new MessageResponse("Link đặt lại mật khẩu đã được gửi đến email của bạn"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: " + e.getMessage()));
        }
    }

    @PostMapping("/reset-password/{token}")
    public ResponseEntity<?> resetPassword(
        @PathVariable String token,
        @RequestBody ResetPasswordRequest request) {
        try {
            userService.resetPassword(token, request.getNewPassword());
            return ResponseEntity.ok(new MessageResponse("Mật khẩu đã được đặt lại thành công"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new MessageResponse("Lỗi: " + e.getMessage()));
        }
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

    @PostMapping("/refresh")
    public ResponseEntity<?> refreshToken(@CookieValue(name = "refreshToken", required = false) String refreshToken) {
        if (refreshToken == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Refresh token không tồn tại"));
        }

        try {
            Optional<String> emailOpt = refreshTokenService.getUserEmailFromRefreshToken(refreshToken);
            if (emailOpt.isPresent()) {
                String newAccessToken = jwtTokenUtil.generateToken(emailOpt.get());
                return ResponseEntity.ok(new TokenResponse(newAccessToken));
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new MessageResponse("Refresh token không hợp lệ"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Lỗi khi refresh token"));
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logout(HttpServletResponse response) {
        Cookie cookie = new Cookie("refreshToken", null);
        cookie.setHttpOnly(true);
        cookie.setSecure(true);
        cookie.setPath("/api/auth");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        
        return ResponseEntity.ok(new MessageResponse("Đăng xuất thành công"));
    }
}