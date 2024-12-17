package com.orebi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.orebi.entity.ProductDetail;
import com.orebi.repository.ProductDetailRepository;

@Service
public class ProductDetailService {
    @Autowired
    private ProductDetailRepository productDetailRepository;

    @Autowired
    private ObjectMapper objectMapper;

    public List<ProductDetail> getAllProductDetails() {
        return productDetailRepository.findAll();
    }

    public Optional<ProductDetail> getProductDetailById(Long id) {
        return productDetailRepository.findById(id);
    }

    public ProductDetail createProductDetail(ProductDetail productDetail) {
        try {
            // Validate JSON format
            objectMapper.readTree(productDetail.getDestable());
            return productDetailRepository.save(productDetail);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("Dữ liệu destable không hợp lệ", e);
        }
    }

    public Optional<ProductDetail> updateProductDetail(Long id, ProductDetail updatedDetail) {
        return productDetailRepository.findById(id)
            .map(existingDetail -> {
                existingDetail.setDescription(updatedDetail.getDescription());
                existingDetail.setDestable(updatedDetail.getDestable());
                return productDetailRepository.save(existingDetail);
            });
    }

    public void deleteProductDetail(Long id) {
        productDetailRepository.deleteById(id);
    }

    public Optional<ProductDetail> getProductDetailByProductId(Long productId) {
        return productDetailRepository.findByProductProductId(productId);
    }
}