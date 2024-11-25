package com.orebi.service;

import com.orebi.entity.ProductDetail;
import com.orebi.repository.ProductDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductDetailService {
    @Autowired
    private ProductDetailRepository productDetailRepository;

    public List<ProductDetail> getAllProductDetails() {
        return productDetailRepository.findAll();
    }

    public Optional<ProductDetail> getProductDetailById(Long id) {
        return productDetailRepository.findById(id);
    }

    public ProductDetail createProductDetail(ProductDetail productDetail) {
        return productDetailRepository.save(productDetail);
    }

    public Optional<ProductDetail> updateProductDetail(Long id, ProductDetail productDetail) {
        if (productDetailRepository.existsById(id)) {
            productDetail.setProductDetailId(id);
            return Optional.of(productDetailRepository.save(productDetail));
        }
        return Optional.empty();
    }

    public void deleteProductDetail(Long id) {
        productDetailRepository.deleteById(id);
    }
}