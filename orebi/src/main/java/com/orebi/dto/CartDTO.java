package com.orebi.dto;

import java.time.LocalDateTime;
import java.util.List;

public class CartDTO {
    private Long cartId;
    // Thông tin user tối giản
    private Long userId;
    private String userName;
    private String userEmail;
    
    // Danh sách sản phẩm trong giỏ hàng
    private List<CartItemDTO> items;
    private LocalDateTime updatedAt;

    // Inner class cho cart item
    public static class CartItemDTO {
        private Long lineItemId;
        private Long productId;
        private String productName;
        private String productImage;
        private double productPrice;
        private Integer quantity;

        // Getters và Setters
        public Long getLineItemId() {
            return lineItemId;
        }

        public void setLineItemId(Long lineItemId) {
            this.lineItemId = lineItemId;
        }

        public Long getProductId() {
            return productId;
        }

        public void setProductId(Long productId) {
            this.productId = productId;
        }

        public String getProductName() {
            return productName;
        }

        public void setProductName(String productName) {
            this.productName = productName;
        }

        public String getProductImage() {
            return productImage;
        }

        public void setProductImage(String productImage) {
            this.productImage = productImage;
        }

        public double getProductPrice() {
            return productPrice;
        }

        public void setProductPrice(double productPrice) {
            this.productPrice = productPrice;
        }

        public Integer getQuantity() {
            return quantity;
        }

        public void setQuantity(Integer quantity) {
            this.quantity = quantity;
        }
    }

    // Getters và Setters cho CartDTO
    public Long getCartId() {
        return cartId;
    }

    public void setCartId(Long cartId) {
        this.cartId = cartId;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public List<CartItemDTO> getItems() {
        return items;
    }

    public void setItems(List<CartItemDTO> items) {
        this.items = items;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }
}
