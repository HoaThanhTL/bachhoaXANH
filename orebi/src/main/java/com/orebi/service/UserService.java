package com.orebi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orebi.dto.LoginDTO;
import com.orebi.dto.RegisterDTO;
import com.orebi.dto.response.MessageResponse;
import com.orebi.entity.Role;
import com.orebi.entity.User;
import com.orebi.exception.ResourceNotFoundException;
import com.orebi.repository.RoleRepository;
import com.orebi.repository.UserRepository;
import com.orebi.security.JwtTokenUtil;


@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtTokenUtil jwtTokenUtil;

    @Autowired
    private EmailService emailService;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private RoleRepository roleRepository;

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public Optional<User> updateUser(Long id, User user) {
        if (userRepository.existsById(id)) {
            user.setUserId(id);
            return Optional.of(userRepository.save(user));
        }
        return Optional.empty();
    }

    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    public ResponseEntity<?> registerUser(RegisterDTO registerDTO) {
        try {
            // Kiểm tra email đã tồn tại
            Optional<User> existingUser = userRepository.findByEmail(registerDTO.getEmail());
            
            if (existingUser.isPresent()) {
                User user = existingUser.get();
                // Nếu tài khoản chưa xác thực OTP, xóa và đăng ký lại
                if (!user.isOtpVerified()) {
                    userRepository.delete(user);
                } else {
                    return ResponseEntity.badRequest()
                        .body(new MessageResponse("Email đã tồn tại và đã được xác thực"));
                }
            }

            // Tạo user mới
            User newUser = new User();
            newUser.setName(registerDTO.getName());
            newUser.setEmail(registerDTO.getEmail());
            newUser.setPassword(passwordEncoder.encode(registerDTO.getPassword()));
            newUser.setPhone(registerDTO.getPhone());
            newUser.setOtpVerified(false);

            // Set role mặc định
            Role userRole = roleRepository.findByRoleName("ROLE_USER")
                .orElseThrow(() -> new RuntimeException("Không tìm thấy ROLE_USER"));
            newUser.setRole(userRole);

            // Tạo và set OTP
            String otp = generateOTP();
            newUser.setOtp(otp);
            newUser.setOtpExpiredAt(LocalDateTime.now().plusMinutes(5));

            // Lưu user và gửi email
            userRepository.save(newUser);
            emailService.sendVerificationEmail(newUser.getEmail(), otp);

            return ResponseEntity.ok(new MessageResponse(
                existingUser.isPresent() 
                    ? "Email đã tồn tại nhưng chưa xác thực. Đã gửi lại mã OTP mới, vui lòng kiểm tra email để xác thực tài khoản"
                    : "Đăng ký thành công. Vui lòng kiểm tra email để xác thực tài khoản"
            ));
            
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(new MessageResponse("Lỗi đăng ký: " + e.getMessage()));
        }
    }

    private String generateOTP() {
        Random random = new Random();
        int otp = 100000 + random.nextInt(900000);
        return String.valueOf(otp);
    }

    public String loginUser(LoginDTO loginDTO) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginDTO.getEmail(), 
                    loginDTO.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            return jwtTokenUtil.generateToken(authentication.getName());
            
        } catch (AuthenticationException e) {
            throw new RuntimeException("Email hoặc mật khẩu không chính xác");
        }
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng với email này"));

        String resetToken = jwtTokenUtil.generatePasswordResetToken(user.getEmail());
        String resetLink = "http://localhost:3000/reset-password/" + resetToken; // Thay đổi domain theo môi trường của bạn

        emailService.sendPasswordResetEmail(user.getEmail(), resetLink);
    }

    public void resetPassword(String token, String newPassword) {
        // Xác thực token
        String email = jwtTokenUtil.validatePasswordResetToken(token);
        if (email == null) {
            throw new RuntimeException("Token không hợp lệ hoặc đã hết hạn");
        }

        // Cập nhật mật khẩu mới
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
        
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public Optional<User> updateUserRole(Long userId, String roleName) {
        Optional<User> userOpt = userRepository.findById(userId);
        if (userOpt.isPresent()) {
            User user = userOpt.get();
            Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            
            user.setRole(role);
            return Optional.of(userRepository.save(user));
        }
        return Optional.empty();
    }

    public User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String email = authentication.getName();
        return userRepository.findByEmail(email)
            .orElseThrow(() -> new ResourceNotFoundException("User not found"));
    }

    public ResponseEntity<?> verifyAccount(String email, String otp) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));

        if (!user.getOtp().equals(otp)) {
            return ResponseEntity.badRequest().body("Invalid OTP");
        }

        if (LocalDateTime.now().isAfter(user.getOtpExpiredAt())) {
            return ResponseEntity.badRequest().body("OTP has expired");
        }

        user.setOtpVerified(true);
        user.setOtp(null);
        user.setOtpExpiredAt(null);
        userRepository.save(user);

        return ResponseEntity.ok("Account verified successfully");
    }

    public void updatePassword(String email, String newPassword) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public User authenticate(String email, String password) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy người dùng"));
            
        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }
        
        return user;
    }
}
