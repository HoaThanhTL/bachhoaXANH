package com.orebi.dto;

public class OrderDetailDTO {
    private Long orderDetailId;
    private Long orderId; // Chỉ lưu ID của Order
    private Long productId; // Chỉ lưu ID của Product
    private int quantity;
    private double totalLineItem;

    // Getters and Setters
    public Long getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Long orderDetailId) {
        this.orderDetailId = orderDetailId;
    }

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public int getQuantity() {
        return quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

    public double getTotalLineItem() {
        return totalLineItem;
    }

    public void setTotalLineItem(double totalLineItem) {
        this.totalLineItem = totalLineItem;
    }
}
