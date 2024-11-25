package com.orebi.entity;

import javax.persistence.*;

@Entity
@Table(name = "roles")
public class Role {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long roleId;
    private String roleName;


    public Long getRoleId() {
        return this.roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }

    public String getRoleName() {
        return this.roleName;
    }

    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }
    
}