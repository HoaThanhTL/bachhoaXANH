package com.orebi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orebi.entity.SubCategory;

@Repository
public interface SubCategoryRepository extends JpaRepository<SubCategory, Long> {
    // Tìm tất cả subcategories theo categoryId
    List<SubCategory> findByCategoryCategoryId(Long categoryId);
    
    // Kiểm tra subcategory có thuộc về category không
    boolean existsByCategoryCategoryIdAndSubCategoryId(Long categoryId, Long subCategoryId);
    
    // Xóa tất cả subcategories của một category
    void deleteByCategoryCategoryId(Long categoryId);
}
