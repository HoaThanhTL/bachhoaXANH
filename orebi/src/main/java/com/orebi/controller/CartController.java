package com.orebi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.orebi.dto.OrderDTO;
import com.orebi.entity.Cart;
import com.orebi.entity.Order;
import com.orebi.service.CartService;
@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<Cart> getCart() {
        return ResponseEntity.ok(cartService.getCart());
    }

    @PostMapping("/add")
    public ResponseEntity<Cart> addToCart(
        @RequestParam Long productId,
        @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(cartService.addToCart(productId, quantity));
    }

    @PutMapping("/update")
    public ResponseEntity<Cart> updateQuantity(
        @RequestParam Long productId,
        @RequestParam Integer quantity
    ) {
        return ResponseEntity.ok(cartService.updateQuantity(productId, quantity));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<Cart> removeFromCart(@RequestParam Long productId) {
        return ResponseEntity.ok(cartService.removeFromCart(productId));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(cartService.checkout(orderDTO));
    }
}
