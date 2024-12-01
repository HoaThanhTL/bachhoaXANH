package com.orebi.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orebi.dto.CategoryTreeDTO;
import com.orebi.dto.SubCategoryDTO;
import com.orebi.entity.Category;
import com.orebi.repository.CategoryRepository;

@Service
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public Category createCategory(Category category) {
        return categoryRepository.save(category);
    }

    public Optional<Category> updateCategory(Long id, Category category) {
        if (categoryRepository.existsById(id)) {
            category.setCategoryId(id);
            return Optional.of(categoryRepository.save(category));
        }
        return Optional.empty();
    }

    public void deleteCategory(Long id) {
        categoryRepository.deleteById(id);
    }

    public List<CategoryTreeDTO> getCategoryTree() {
        List<Category> categories = categoryRepository.findAll();
        return categories.stream()
            .map(this::convertToCategoryTreeDTO)
            .collect(Collectors.toList());
    }

    private CategoryTreeDTO convertToCategoryTreeDTO(Category category) {
        CategoryTreeDTO dto = new CategoryTreeDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        
        List<SubCategoryDTO> subCategoryDTOs = category.getSubCategories().stream()
            .map(sub -> {
                SubCategoryDTO subDTO = new SubCategoryDTO();
                subDTO.setSubCategoryId(sub.getSubCategoryId());
                subDTO.setName(sub.getName());
                return subDTO;
            })
            .collect(Collectors.toList());
            
        dto.setSubCategories(subCategoryDTOs);
        return dto;
    }
}