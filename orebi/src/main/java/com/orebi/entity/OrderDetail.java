package com.orebi.entity;

import javax.persistence.*;

@Entity
@Table(name = "order_details")
public class OrderDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderDetailId;

    @ManyToOne
    @JoinColumn(name = "order_id")
    private Order order;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;
    private double totalLineItem;

    // Getters and Setters
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

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
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