package com.orebi.entity;

import javax.persistence.*;

@Entity
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long userId;
    private String phone;
    private String password;
    private String name;
    private String otp;
    private String email;
    private boolean verified;

    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;

    // Getters and Setters
    public void setUserId(Long id) {
        this.userId = id;
    }


    public Long getUserId() {
        return this.userId;
    }


    public String getPhone() {
        return this.phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getPassword() {
        return this.password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getOtp() {
        return this.otp;
    }

    public void setOtp(String otp) {
        this.otp = otp;
    }

    public String getEmail() {
        return this.email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public boolean isVerified() {
        return this.verified;
    }

    public boolean getVerified() {
        return this.verified;
    }

    public void setVerified(boolean verified) {
        this.verified = verified;
    }

    public Role getRole() {
        return this.role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

}