package com.orebi.dto;

import java.util.List;

public class ProductDetailDTO {
    private Long productDetailId;
    private Long productId;
    private String description;
    private DestableData destable;
    private List<ProductImageDTO> images;

    // Class để lưu dữ liệu bảng động
    public static class DestableData {
        private List<String> headers;     // Tên các cột
        private List<List<String>> rows;  // Dữ liệu các dòng

        // Getters và Setters
        public List<String> getHeaders() {
            return headers;
        }

        public void setHeaders(List<String> headers) {
            this.headers = headers;
        }

        public List<List<String>> getRows() {
            return rows;
        }

        public void setRows(List<List<String>> rows) {
            this.rows = rows;
        }
    }
    
    // Getters và Setters
    public Long getProductDetailId() {
        return productDetailId;
    }

    public void setProductDetailId(Long productDetailId) {
        this.productDetailId = productDetailId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public DestableData getDestable() {
        return destable;
    }

    public void setDestable(DestableData destable) {
        this.destable = destable;
    }

    public List<ProductImageDTO> getImages() {
        return images;
    }

    public void setImages(List<ProductImageDTO> images) {
        this.images = images;
    }
}
