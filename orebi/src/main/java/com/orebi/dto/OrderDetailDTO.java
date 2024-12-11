package com.orebi.dto;

public class OrderDetailDTO {
    private Long orderDetailId;
    private Long orderId;
    private Long snapshotProductId;
    private String snapshotProductName;
    private String snapshotProductImage;
    private double snapshotPrice;
    private int quantity;
    private double totalLineItem;

    // Getters and setters
    public Long getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Long orderDetailId) {
        this.orderDetailId = orderDetailId;
    }

    public Long getSnapshotProductId() {
        return snapshotProductId;
    }

    public void setSnapshotProductId(Long snapshotProductId) {
        this.snapshotProductId = snapshotProductId;
    }

    public String getSnapshotProductName() {
        return snapshotProductName;
    }

    public void setSnapshotProductName(String snapshotProductName) {
        this.snapshotProductName = snapshotProductName;
    }

    public String getSnapshotProductImage() {
        return snapshotProductImage;
    }

    public void setSnapshotProductImage(String snapshotProductImage) {
        this.snapshotProductImage = snapshotProductImage;
    }

    public double getSnapshotPrice() {
        return snapshotPrice;
    }

    public void setSnapshotPrice(double snapshotPrice) {
        this.snapshotPrice = snapshotPrice;
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

    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }
}
