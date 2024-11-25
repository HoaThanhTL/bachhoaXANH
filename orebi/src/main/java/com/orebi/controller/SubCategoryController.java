package com.orebi.controller;

import com.orebi.dto.SubCategoryDTO;
import com.orebi.entity.SubCategory;
import com.orebi.service.SubCategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/subcategories")
public class SubCategoryController {
    @Autowired
    private SubCategoryService subCategoryService;

    @GetMapping
    public List<SubCategoryDTO> getAllSubCategories() {
        return subCategoryService.getAllSubCategories().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SubCategoryDTO> getSubCategoryById(@PathVariable Long id) {
        return subCategoryService.getSubCategoryById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public SubCategoryDTO createSubCategory(@RequestBody SubCategoryDTO subCategoryDTO) {
        SubCategory subCategory = convertToEntity(subCategoryDTO);
        SubCategory createdSubCategory = subCategoryService.createSubCategory(subCategory);
        return convertToDTO(createdSubCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<SubCategoryDTO> updateSubCategory(@PathVariable Long id, @RequestBody SubCategoryDTO subCategoryDTO) {
        return subCategoryService.updateSubCategory(id, convertToEntity(subCategoryDTO))
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSubCategory(@PathVariable Long id) {
        subCategoryService.deleteSubCategory(id);
        return ResponseEntity.noContent().build();
    }

    private SubCategoryDTO convertToDTO(SubCategory subCategory) {
        SubCategoryDTO dto = new SubCategoryDTO();
        dto.setSubcategoryId(subCategory.getSubcategoryId());
        dto.setName(subCategory.getName());
        dto.setCategoryId(subCategory.getCategory().getCategoryId());
        return dto;
    }

    private SubCategory convertToEntity(SubCategoryDTO subCategoryDTO) {
        SubCategory subCategory = new SubCategory();
        subCategory.setSubcategoryId(subCategoryDTO.getSubcategoryId());
        subCategory.setName(subCategoryDTO.getName());
        // Set Category entity based on ID
        return subCategory;
    }
}