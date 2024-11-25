package com.orebi.entity;

import javax.persistence.*;

@Entity
@Table(name = "line_items")
public class LineItem {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long lineItemId;

    @ManyToOne
    @JoinColumn(name = "cart_id")
    private Cart cart;

    @ManyToOne
    @JoinColumn(name = "product_id")
    private Product product;

    private int quantity;

    // Getters and Setters
    public void setLineItemId(Long id) {
        this.lineItemId = id;
    }

    public Long getLineItemId() {
        return this.lineItemId;
    }


    public Cart getCart() {
        return this.cart;
    }

    public void setCart(Cart cart) {
        this.cart = cart;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public int getQuantity() {
        return this.quantity;
    }

    public void setQuantity(int quantity) {
        this.quantity = quantity;
    }

}