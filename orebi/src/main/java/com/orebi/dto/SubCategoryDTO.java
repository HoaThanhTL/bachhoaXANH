package com.orebi.dto;

public class SubCategoryDTO {
    private Long subcategoryId;
    private String name;
    private Long categoryId; // Chỉ lưu ID của Category

    // Getters and Setters
    public Long getSubcategoryId() {
        return subcategoryId;
    }

    public void setSubcategoryId(Long subcategoryId) {
        this.subcategoryId = subcategoryId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }
} 