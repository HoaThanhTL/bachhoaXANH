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

import com.orebi.dto.ProductDetailDTO;
import com.orebi.dto.ProductImageDTO;
import com.orebi.entity.ProductDetail;
import com.orebi.entity.ProductImage;
import com.orebi.service.ProductDetailService;

@RestController
@RequestMapping("/api/product-details")
public class ProductDetailController {
    @Autowired
    private ProductDetailService productDetailService;

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
    public ProductDetailDTO createProductDetail(@RequestBody ProductDetailDTO productDetailDTO) {
        ProductDetail productDetail = convertToEntity(productDetailDTO);
        ProductDetail createdProductDetail = productDetailService.createProductDetail(productDetail);
        return convertToDTO(createdProductDetail);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ProductDetailDTO> updateProductDetail(
            @PathVariable Long id,
            @RequestBody ProductDetailDTO productDetailDTO) {
        return productDetailService.updateProductDetail(id, convertToEntity(productDetailDTO))
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProductDetail(@PathVariable Long id) {
        productDetailService.deleteProductDetail(id);
        return ResponseEntity.noContent().build();
    }

    private ProductDetailDTO convertToDTO(ProductDetail productDetail) {
        ProductDetailDTO dto = new ProductDetailDTO();
        dto.setProductDetailId(productDetail.getProductDetailId());
        dto.setDescription(productDetail.getDescription());
        dto.setDestable(productDetail.getDestable());
        if (productDetail.getProduct() != null) {
            dto.setProductId(productDetail.getProduct().getProductId());
        }
        
        // Convert images
        if (productDetail.getImages() != null) {
            dto.setImages(productDetail.getImages().stream()
                .map(this::convertImageToDTO)
                .collect(Collectors.toList()));
        }
        return dto;
    }

    private ProductImageDTO convertImageToDTO(ProductImage image) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setImageId(image.getImageId());
        dto.setImageUrl(image.getImageUrl());
        dto.setProductDetailId(image.getProductDetail().getProductDetailId());
        return dto;
    }

    private ProductDetail convertToEntity(ProductDetailDTO dto) {
        ProductDetail productDetail = new ProductDetail();
        productDetail.setProductDetailId(dto.getProductDetailId());
        productDetail.setDescription(dto.getDescription());
        productDetail.setDestable(dto.getDestable());
        // Product entity sẽ được set trong service layer
        return productDetail;
    }
} 