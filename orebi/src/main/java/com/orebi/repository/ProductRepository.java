package com.orebi.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.orebi.entity.Product;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {
    List<Product> findByCategoryCategoryId(Long categoryId);
    
    @Query("SELECT p FROM Product p WHERE p.subCategory.subCategoryId = :subCategoryId")
    List<Product> findBySubCategoryId(@Param("subCategoryId") Long subCategoryId);
    
    List<Product> findByNameContainingIgnoreCase(String keyword);
}
