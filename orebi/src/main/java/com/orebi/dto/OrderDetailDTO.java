package com.orebi.dto;

public class OrderDetailDTO {
    private Long orderDetailId;
    private Long orderId;
    private ProductSnapshotDTO productSnapshot;
    private int quantity;
    private double totalLineItem;

    // Getters/setters
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

    public ProductSnapshotDTO getProductSnapshot() {
        return productSnapshot;
    }

    public void setProductSnapshot(ProductSnapshotDTO productSnapshot) {
        this.productSnapshot = productSnapshot;
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
