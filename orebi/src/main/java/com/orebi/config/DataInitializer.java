package com.orebi.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import com.orebi.entity.Role;
import com.orebi.repository.RoleRepository;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;

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
    }
}