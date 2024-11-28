package com.orebi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orebi.entity.Category;
import com.orebi.entity.SubCategory;
import com.orebi.repository.CategoryRepository;
import com.orebi.repository.SubCategoryRepository;

@Service
public class SubCategoryService {
    @Autowired
    private SubCategoryRepository subCategoryRepository;
    
    @Autowired
    private CategoryRepository categoryRepository;

    public List<SubCategory> getAllSubCategories() {
        return subCategoryRepository.findAll();
    }

    public Optional<SubCategory> getSubCategoryById(Long id) {
        return subCategoryRepository.findById(id);
    }

    public List<SubCategory> getSubCategoriesByCategoryId(Long categoryId) {
        return subCategoryRepository.findByCategoryCategoryId(categoryId);
    }

    public SubCategory createSubCategory(Long categoryId, SubCategory subCategory) {
        Category category = categoryRepository.findById(categoryId)
            .orElseThrow(() -> new RuntimeException("Category not found"));
        subCategory.setCategory(category);
        return subCategoryRepository.save(subCategory);
    }

    public Optional<SubCategory> updateSubCategory(Long categoryId, Long id, SubCategory subCategory) {
        if (subCategoryRepository.existsById(id)) {
            Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new RuntimeException("Category not found"));
            subCategory.setSubCategoryId(id);
            subCategory.setCategory(category);
            return Optional.of(subCategoryRepository.save(subCategory));
        }
        return Optional.empty();
    }

    public void deleteSubCategory(Long id) {
        subCategoryRepository.deleteById(id);
    }
}
