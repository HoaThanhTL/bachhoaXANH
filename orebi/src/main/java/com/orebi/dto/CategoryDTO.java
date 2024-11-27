package com.orebi.dto;

import java.util.List;

public class CategoryDTO {
    private Long categoryId;
    private String name;
    private String image;
    private List<SubCategoryDTO> subcategories;

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

    public String getImage() {
        return image;
    }

    public void setImage(String image) {
        this.image = image;
    }

    public List<SubCategoryDTO> getSubcategories() {
        return subcategories;
    }

    public void setSubcategories(List<SubCategoryDTO> subcategories) {
        this.subcategories = subcategories;
    }
} 