package com.orebi.controller;

import com.orebi.entity.User;
import com.orebi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.crypto.password.PasswordEncoder;

@RestController
@RequestMapping("/api/users")
public class UserController {
    @Autowired
    private UserService userService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping("/current")
    public ResponseEntity<User> getCurrentUser() {
        User currentUser = userService.getCurrentUser();
        return ResponseEntity.ok(currentUser);
    }

    @PutMapping("/current")
    public ResponseEntity<User> updateCurrentUser(@RequestBody User user) {
        // Lấy thông tin người dùng hiện tại
        User currentUser = userService.getCurrentUser();

        // Cập nhật thông tin người dùng nếu có giá trị mới
        if (user.getName() != null) {
            currentUser.setName(user.getName());
        }
        if (user.getEmail() != null) {
            currentUser.setEmail(user.getEmail());
        }
        if (user.getPhone() != null) {
            currentUser.setPhone(user.getPhone());
        }
        if (user.getPassword() != null && !user.getPassword().isEmpty()) {
            currentUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }
        if (user.getAddress() != null) {
            currentUser.setAddress(user.getAddress());
        }

        // Lưu thông tin đã cập nhật
        userService.updateUser(currentUser.getUserId(), currentUser);

        return ResponseEntity.ok(currentUser);
    }
}