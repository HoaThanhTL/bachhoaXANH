package com.orebi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orebi.entity.SubCategory;
import com.orebi.repository.SubCategoryRepository;

@Service
public class SubCategoryService {
    @Autowired
    private SubCategoryRepository subCategoryRepository;

    public List<SubCategory> getAllSubCategories() {
        return subCategoryRepository.findAll();
    }

    public Optional<SubCategory> getSubCategoryById(Long id) {
        return subCategoryRepository.findById(id);
    }

    public SubCategory createSubCategory(SubCategory subCategory) {
        return subCategoryRepository.save(subCategory);
    }

    public Optional<SubCategory> updateSubCategory(Long id, SubCategory subCategory) {
        if (subCategoryRepository.existsById(id)) {
            subCategory.setSubCategoryId(id);
            return Optional.of(subCategoryRepository.save(subCategory));
        }
        return Optional.empty();
    }

    public void deleteSubCategory(Long id) {
        subCategoryRepository.deleteById(id);
    }
}
