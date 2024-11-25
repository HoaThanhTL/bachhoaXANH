package com.orebi.entity;

import javax.persistence.*;

@Entity
@Table(name = "product_details")
public class ProductDetail {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long productDetailId;
    private String description;
    private String desTable;

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

    public String getDesTable() {
        return desTable;
    }

    public void setDesTable(String desTable) {
        this.desTable = desTable;
    }
}