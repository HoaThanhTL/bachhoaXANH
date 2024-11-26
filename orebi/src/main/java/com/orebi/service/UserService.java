package com.orebi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.orebi.dto.LoginDTO;
import com.orebi.dto.RegisterDTO;
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

    public User registerUser(RegisterDTO registerDTO) {
        User user = new User();
        user.setEmail(registerDTO.getEmail());
        user.setPassword(passwordEncoder.encode(registerDTO.getPassword()));

        return userRepository.save(user);
    }

    public String loginUser(LoginDTO loginDTO) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(loginDTO.getEmail(), loginDTO.getPassword())
        );
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return jwtTokenUtil.generateToken(userDetails);
    }

    public void sendPasswordResetEmail(String email) {
        User user = userRepository.findByEmail(email)
            .orElseThrow(() -> new RuntimeException("User not found"));
        String resetToken = jwtTokenUtil.generatePasswordResetToken(user.getEmail());
        emailService.sendPasswordResetEmail(user.getEmail(), resetToken);
    }

    public Optional<User> updateUserRole(Long userId, String roleName) {
        if (userRepository.existsById(userId)) {
            User user = userRepository.findById(userId).get();
            Role role = roleRepository.findByRoleName(roleName)
                .orElseThrow(() -> new RuntimeException("Role not found: " + roleName));
            
            user.getRoles().clear();
            user.getRoles().add(role);
            
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
}
