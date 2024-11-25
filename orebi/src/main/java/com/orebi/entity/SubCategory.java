package com.orebi.entity;

import javax.persistence.*;

@Entity
@Table(name = "subcategories")
public class SubCategory {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long subcategoryId;
    private String name;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private Category category;

    // Getters and Setters
    public void setSubcategoryId(Long id) {
        this.subcategoryId = id;
    }


    public Long getSubcategoryId() {
        return this.subcategoryId;
    }


    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

}