package com.orebi.entity;


import com.fasterxml.jackson.annotation.JsonBackReference;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
@Entity
@Table(name = "order_detail")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderDetailId;

    @JsonBackReference
    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    private int quantity;
    private double totalLineItem;

    // Các trường snapshot
    private Long snapshotProductId;
    private String snapshotProductName;
    private String snapshotProductImage;
    private double snapshotPrice;

    // Getters và setters
    public Long getOrderDetailId() {
        return orderDetailId;
    }

    public void setOrderDetailId(Long orderDetailId) {
        this.orderDetailId = orderDetailId;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
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
}