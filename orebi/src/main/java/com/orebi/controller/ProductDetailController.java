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

import com.fasterxml.jackson.databind.ObjectMapper;
import com.orebi.dto.ProductDetailDTO;
import com.orebi.dto.ProductImageDTO;
import com.orebi.entity.Product;
import com.orebi.entity.ProductDetail;
import com.orebi.entity.ProductImage;
import com.orebi.service.ProductDetailService;
import com.orebi.service.ProductService;

@RestController
@RequestMapping("/api/product-details")
public class ProductDetailController {
    @Autowired
    private ProductDetailService productDetailService;

    @Autowired
    private ProductService productService;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping
    public List<ProductDetailDTO> getAllProductDetails() {
        return productDetailService.getAllProductDetails().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> getProductDetailById(@PathVariable Long id) {
        return productDetailService.getProductDetailById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ProductDetailDTO> getProductDetailByProductId(@PathVariable Long productId) {
        return productDetailService.getProductDetailByProductId(productId)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<ProductDetailDTO> createProductDetail(@RequestBody ProductDetailDTO dto) {
        try {
            // Kiểm tra product tồn tại
            Product product = productService.convertToEntity(
                productService.getProductById(dto.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found"))
            );
            
            // Kiểm tra product đã có detail chưa
            if (productDetailService.getProductDetailByProductId(dto.getProductId()).isPresent()) {
                throw new RuntimeException("Product detail already exists");
            }

            // Tạo mới product detail
            ProductDetail detail = convertToEntity(dto);
            detail.setProduct(product);
            
            ProductDetail savedDetail = productDetailService.createProductDetail(detail);
            return ResponseEntity.ok(convertToDTO(savedDetail));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ProductDetailDTO()); // hoặc trả về error message
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> updateProductDetail(
            @PathVariable Long id, 
            @RequestBody ProductDetailDTO dto) {
        return productDetailService.updateProductDetail(id, convertToEntity(dto))
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductDetail(@PathVariable Long id) {
        productDetailService.deleteProductDetail(id);
        return ResponseEntity.noContent().build();
    }

    private ProductDetailDTO convertToDTO(ProductDetail detail) {
        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setProductDetailId(detail.getProductDetailId());
        dto.setDescription(detail.getDescription());
        dto.setProductId(detail.getProduct().getProductId());
        try {
            // Parse JSON string to DestableData object
            ProductDetailDTO.DestableData destableData = objectMapper.readValue(
                detail.getDestable(), 
                ProductDetailDTO.DestableData.class
            );
            dto.setDestable(destableData);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi chuyển đổi dữ li���u destable", e);
        }
        
        return dto;
    }

    private ProductDetail convertToEntity(ProductDetailDTO dto) {
        ProductDetail detail = new ProductDetail();
        detail.setProductDetailId(dto.getProductDetailId());
        detail.setDescription(dto.getDescription());
        detail.setProduct(productService.convertToEntity(
            productService.getProductById(dto.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"))
        ));
        try {
            String destableJson = objectMapper.writeValueAsString(dto.getDestable());
            detail.setDestable(destableJson);
        } catch (Exception e) {
            throw new RuntimeException("Lỗi khi chuyển đổi dữ liệu destable", e);
        }
        
        return detail;
    }

    private ProductImageDTO convertImageToDTO(ProductImage image) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setImageId(image.getImageId());
        dto.setImageUrl(image.getImageUrl());
        dto.setProductDetailId(image.getProductDetail().getProductDetailId());
        return dto;
    }
} 