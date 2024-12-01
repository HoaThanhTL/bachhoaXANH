package com.orebi.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orebi.entity.Cart;
import com.orebi.entity.User;
import com.orebi.repository.CartRepository;


@Service
public class CartService {
    @Autowired
    private CartRepository cartRepository;
    
    @Autowired
    private UserService userService;

    public Cart getCurrentUserCart() {
        User currentUser = userService.getCurrentUser();
        
        // Tìm giỏ hàng hiện tại của user
        return cartRepository.findByUser(currentUser)
            .orElseGet(() -> {
                // Nếu chưa có giỏ hàng thì tạo mới
                Cart newCart = new Cart();
                newCart.setUser(currentUser);
                return cartRepository.save(newCart);
            });
    }
}
