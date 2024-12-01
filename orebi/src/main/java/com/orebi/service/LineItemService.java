package com.orebi.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orebi.entity.Cart;
import com.orebi.entity.LineItem;
import com.orebi.exception.InvalidDataException;
import com.orebi.repository.LineItemRepository;

@Service
public class LineItemService {
    @Autowired
    private LineItemRepository lineItemRepository;
    
    @Autowired
    private CartService cartService;

    public List<LineItem> getCurrentUserCart() {
        Cart cart = cartService.getCurrentUserCart();
        return lineItemRepository.findByCart(cart);
    }

    public LineItem createLineItem(LineItem lineItem) {
        if (lineItem.getQuantity() <= 0) {
            throw new InvalidDataException("Số lượng phải lớn hơn 0");
        }

        Cart currentCart = cartService.getCurrentUserCart();
        Optional<LineItem> existingItem = lineItemRepository
            .findByCartAndProduct(currentCart, lineItem.getProduct());
            
        if (existingItem.isPresent()) {
            LineItem item = existingItem.get();
            item.setQuantity(item.getQuantity() + lineItem.getQuantity());
            return lineItemRepository.save(item);
        }

        lineItem.setCart(currentCart);
        return lineItemRepository.save(lineItem);
    }

    public Optional<LineItem> updateLineItem(Long lineItemId, LineItem lineItem) {
        Cart currentCart = cartService.getCurrentUserCart();
        
        return lineItemRepository.findByLineItemIdAndCart(lineItemId, currentCart)
            .map(existingItem -> {
                if (lineItem.getQuantity() <= 0) {
                    throw new InvalidDataException("Số lượng phải lớn hơn 0");
                }
                existingItem.setQuantity(lineItem.getQuantity());
                return lineItemRepository.save(existingItem);
            });
    }

    public void deleteLineItem(Long lineItemId) {
        Cart currentCart = cartService.getCurrentUserCart();
        lineItemRepository.deleteByLineItemIdAndCart(lineItemId, currentCart);
    }
}
