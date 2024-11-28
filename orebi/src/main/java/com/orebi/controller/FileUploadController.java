package com.orebi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.orebi.Cloudinary.CloudinaryService;
import com.orebi.Cloudinary.CloudinaryUploadResponse;
import com.orebi.dto.ProductImageDTO;
import com.orebi.entity.ProductImage;
import com.orebi.service.ProductImageService;

@RestController
@RequestMapping("/api/upload")
public class FileUploadController {
    @Autowired
    private CloudinaryService cloudinaryService;
    
    @Autowired
    private ProductImageService productImageService;

    @PostMapping("/product-image/{productDetailId}")
    public ResponseEntity<ProductImageDTO> uploadProductImage(
            @RequestParam("file") MultipartFile file,
            @PathVariable Long productDetailId) {
        try {
            // Upload to Cloudinary
            CloudinaryUploadResponse response = cloudinaryService.uploadFile(file);
            
            // Save to database
            ProductImage productImage = new ProductImage();
            productImage.setImageUrl(response.getUrl());
            productImage.setPublicId(response.getPublicId());
            
            ProductImageDTO savedImage = productImageService.addImageToProduct(
                productDetailId, 
                productImage
            );
            
            return ResponseEntity.ok(savedImage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(null);
        }
    }

    @DeleteMapping("/product-image/{imageId}")
    public ResponseEntity<Void> deleteProductImage(@PathVariable Long imageId) {
        try {
            productImageService.deleteImage(imageId);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
