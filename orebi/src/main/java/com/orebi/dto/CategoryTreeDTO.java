package com.orebi.dto;

import java.util.List;

public class CategoryTreeDTO {
    private Long categoryId;
    private String name;
    private List<SubCategoryDTO> subCategories;

    // Getters and Setters
    public Long getCategoryId() { return categoryId; }
    public void setCategoryId(Long categoryId) { this.categoryId = categoryId; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public List<SubCategoryDTO> getSubCategories() { return subCategories; }
    public void setSubCategories(List<SubCategoryDTO> subCategories) { this.subCategories = subCategories; }
}

