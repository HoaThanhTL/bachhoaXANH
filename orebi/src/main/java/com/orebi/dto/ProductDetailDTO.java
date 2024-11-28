package com.orebi.dto;

import java.util.List;

public class ProductDetailDTO {
    private Long productDetailId;
    private String description;
    private String destable;
    private Long productId;
    private List<ProductImageDTO> images;

    // Getters and Setters
    public Long getProductDetailId() {
        return productDetailId;
    }

    public void setProductDetailId(Long productDetailId) {
        this.productDetailId = productDetailId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getDestable() {
        return destable;
    }

    public void setDestable(String destable) {
        this.destable = destable;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public List<ProductImageDTO> getImages() {
        return images;
    }

    public void setImages(List<ProductImageDTO> images) {
        this.images = images;
    }
}
