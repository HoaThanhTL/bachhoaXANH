package com.orebi.dto;

public class SubCategoryDTO {
    private Long subCategoryId;
    private String name;
    private Long categoryId;
    private String categoryName;

    // Constructors
    public SubCategoryDTO() {}

    public SubCategoryDTO(Long subCategoryId, String name, Long categoryId, String categoryName) {
        this.subCategoryId = subCategoryId;
        this.name = name;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
    }

    // Getters and Setters
    public Long getSubCategoryId() { return subCategoryId; }
    public void setSubCategoryId(Long subCategoryId) { this.subCategoryId = subCategoryId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }

    public String getCategoryName() { return categoryName; }
    public void setCategoryName(String categoryName) { this.categoryName = categoryName; }
} 