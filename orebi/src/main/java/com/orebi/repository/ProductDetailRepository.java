package com.orebi.repository;

import com.orebi.entity.ProductDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductDetailRepository extends JpaRepository<ProductDetail, Long> {
}