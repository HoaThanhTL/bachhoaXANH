package com.orebi.controller;

import com.orebi.entity.ProductDetail;
import com.orebi.service.ProductDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/product-details")
public class ProductDetailController {
    @Autowired
    private ProductDetailService productDetailService;

    @GetMapping
    public List<ProductDetail> getAllProductDetails() {
        return productDetailService.getAllProductDetails();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetail> getProductDetailById(@PathVariable Long id) {
        return productDetailService.getProductDetailById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ProductDetail createProductDetail(@RequestBody ProductDetail productDetail) {
        return productDetailService.createProductDetail(productDetail);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetail> updateProductDetail(@PathVariable Long id, @RequestBody ProductDetail productDetail) {
        return productDetailService.updateProductDetail(id, productDetail)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductDetail(@PathVariable Long id) {
        productDetailService.deleteProductDetail(id);
        return ResponseEntity.noContent().build();
    }
} 