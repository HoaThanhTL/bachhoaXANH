package com.orebi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import com.orebi.entity.Role;
import com.orebi.entity.User;
import com.orebi.repository.RoleRepository;
import com.orebi.repository.UserRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        // Kiểm tra và tạo ROLE_USER nếu chưa tồn tại
        if (!roleRepository.findByRoleName("ROLE_USER").isPresent()) {
            Role userRole = new Role();
            userRole.setRoleName("ROLE_USER");
            roleRepository.save(userRole);
        }

        // Kiểm tra và tạo ROLE_ADMIN nếu chưa tồn tại
        if (!roleRepository.findByRoleName("ROLE_ADMIN").isPresent()) {
            Role adminRole = new Role();
            adminRole.setRoleName("ROLE_ADMIN");
            roleRepository.save(adminRole);
        }

        // Kiểm tra và tạo tài khoản admin mặc định nếu chưa tồn tại
        if (!userRepository.findByEmail("admin@example.com").isPresent()) {
            User admin = new User();
            admin.setEmail("admin@example.com");
            admin.setPassword(passwordEncoder.encode("admin123")); // Mã hóa mật khẩu
            admin.setName("Admin User");
            admin.setRole(roleRepository.findByRoleName("ROLE_ADMIN").get());
            userRepository.save(admin);
        }

        // Thêm mới: Tạo tài khoản user mặc định
        if (!userRepository.findByEmail("user@example.com").isPresent()) {
            User user = new User();
            user.setEmail("user@example.com");
            user.setPassword(passwordEncoder.encode("user123")); // Mã hóa mật khẩu
            user.setName("Normal User");
            user.setRole(roleRepository.findByRoleName("ROLE_USER").get());
            userRepository.save(user);
        }
    }
}