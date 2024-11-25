package com.orebi.entity;

import javax.persistence.*;
import java.util.List;
import java.util.ArrayList;

@Entity
@Table(name = "categories")
public class Category {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long categoryId;
    private String name;

    @OneToMany(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<SubCategory> subcategories;

    // Getters and Setters
    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<SubCategory> getSubcategories() {
        return new ArrayList<>(subcategories);
    }

    public void setSubcategories(List<SubCategory> subcategories) {
        this.subcategories = subcategories;
    }
}