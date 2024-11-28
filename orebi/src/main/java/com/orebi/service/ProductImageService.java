package com.orebi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orebi.Cloudinary.CloudinaryService;
import com.orebi.dto.ProductImageDTO;
import com.orebi.entity.ProductDetail;
import com.orebi.entity.ProductImage;
import com.orebi.repository.ProductImageRepository;

@Service
public class ProductImageService {
    @Autowired
    private ProductImageRepository productImageRepository;
    
    @Autowired
    private ProductDetailService productDetailService;
    
    @Autowired
    private CloudinaryService cloudinaryService;

    public ProductImageDTO addImageToProduct(Long productDetailId, ProductImage image) {
        ProductDetail productDetail = productDetailService.getProductDetailById(productDetailId)
            .orElseThrow(() -> new RuntimeException("ProductDetail not found"));
            
        image.setProductDetail(productDetail);
        ProductImage savedImage = productImageRepository.save(image);
        
        return convertToDTO(savedImage);
    }

    public void deleteImage(Long imageId) {
        ProductImage image = productImageRepository.findById(imageId)
            .orElseThrow(() -> new RuntimeException("Image not found"));
            
        // Delete from Cloudinary
        if (image.getPublicId() != null) {
            cloudinaryService.deleteFile(image.getPublicId());
        }
        
        // Delete from database
        productImageRepository.delete(image);
    }

    private ProductImageDTO convertToDTO(ProductImage image) {
        ProductImageDTO dto = new ProductImageDTO();
        dto.setImageId(image.getImageId());
        dto.setImageUrl(image.getImageUrl());
        dto.setProductDetailId(image.getProductDetail().getProductDetailId());
        return dto;
    }
}
