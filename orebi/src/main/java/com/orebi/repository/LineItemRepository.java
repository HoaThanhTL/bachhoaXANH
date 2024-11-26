package com.orebi.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orebi.entity.Cart;
import com.orebi.entity.LineItem;
import com.orebi.entity.Product;

@Repository
public interface LineItemRepository extends JpaRepository<LineItem, Long> {
    List<LineItem> findByCart(Cart cart);
    Optional<LineItem> findByCartAndProduct(Cart cart, Product product);
    Optional<LineItem> findByLineItemIdAndCart(Long lineItemId, Cart cart);
    void deleteByLineItemIdAndCart(Long lineItemId, Cart cart); 
}
