package com.orebi.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orebi.dto.CategoryDTO;
import com.orebi.dto.CategoryTreeDTO;
import com.orebi.dto.SubCategoryDTO;
import com.orebi.entity.Category;
import com.orebi.service.CategoryService;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    @Autowired
    private CategoryService categoryService;

    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return categoryService.getAllCategories().stream()
                .map(category -> {
                    CategoryDTO dto = convertToDTO(category);
                    dto.setSubCategories(category.getSubCategories().stream()
                            .map(sub -> new SubCategoryDTO(
                                sub.getSubCategoryId(),
                                sub.getName(),
                                category.getCategoryId(),
                                category.getName()
                            ))
                            .collect(Collectors.toList()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<CategoryDTO> getCategoryById(@PathVariable Long id) {
        return categoryService.getCategoryById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public CategoryDTO createCategory(@RequestBody CategoryDTO categoryDTO) {
        Category category = convertToEntity(categoryDTO);
        Category createdCategory = categoryService.createCategory(category);
        return convertToDTO(createdCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<CategoryDTO> updateCategory(@PathVariable Long id, @RequestBody CategoryDTO categoryDTO) {
        return categoryService.updateCategory(id, convertToEntity(categoryDTO))
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/tree")
    public List<CategoryTreeDTO> getCategoryTree() {
        return categoryService.getAllCategories().stream()
                .map(category -> {
                    CategoryTreeDTO dto = new CategoryTreeDTO();
                    dto.setCategoryId(category.getCategoryId());
                    dto.setName(category.getName());
                    dto.setImage(category.getImage());
                    dto.setSubCategories(category.getSubCategories().stream()
                            .map(sub -> new SubCategoryDTO(
                                sub.getSubCategoryId(),
                                sub.getName(),
                                category.getCategoryId(),
                                category.getName()
                            ))
                            .collect(Collectors.toList()));
                    return dto;
                })
                .collect(Collectors.toList());
    }

    private CategoryDTO convertToDTO(Category category) {
        CategoryDTO dto = new CategoryDTO();
        dto.setCategoryId(category.getCategoryId());
        dto.setName(category.getName());
        dto.setImage(category.getImage());
        return dto;
    }

    private Category convertToEntity(CategoryDTO categoryDTO) {
        Category category = new Category();
        category.setCategoryId(categoryDTO.getCategoryId());
        category.setName(categoryDTO.getName());
        category.setImage(categoryDTO.getImage());
        return category;
    }
}
