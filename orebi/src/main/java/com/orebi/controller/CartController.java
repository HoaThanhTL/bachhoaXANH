package com.orebi.controller;

import java.util.List;
import java.util.stream.Collectors;

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

import com.orebi.dto.CartDTO;
import com.orebi.dto.OrderDTO;
import com.orebi.entity.Cart;
import com.orebi.entity.Order;
import com.orebi.service.CartService;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    @Autowired
    private CartService cartService;

    // Phương thức chung để chuyển đổi Cart -> CartDTO
    private CartDTO convertToDTO(Cart cart) {
        CartDTO dto = new CartDTO();
        
        // Set thông tin cart
        dto.setCartId(cart.getCartId());
        dto.setUserId(cart.getUser().getUserId());
        dto.setUserName(cart.getUser().getName());
        dto.setUserEmail(cart.getUser().getEmail());
        dto.setUpdatedAt(cart.getUpdatedAt());
        
        // Convert line items
        List<CartDTO.CartItemDTO> items = cart.getLineItems().stream()
            .map(lineItem -> {
                CartDTO.CartItemDTO item = new CartDTO.CartItemDTO();
                item.setLineItemId(lineItem.getLineItemId());
                item.setProductId(lineItem.getProduct().getProductId());
                item.setProductName(lineItem.getProduct().getName());
                item.setProductImage(lineItem.getProduct().getImage());
                item.setProductPrice(lineItem.getProduct().getDiscountedPrice());
                item.setQuantity(lineItem.getQuantity());
                return item;
            })
            .collect(Collectors.toList());
            
        dto.setItems(items);
        return dto;
    }

    @GetMapping
    public ResponseEntity<CartDTO> getCart() {
        Cart cart = cartService.getCart();
        return ResponseEntity.ok(convertToDTO(cart));
    }

    @PostMapping("/add")
    public ResponseEntity<CartDTO> addToCart(
        @RequestParam Long productId,
        @RequestParam Integer quantity
    ) {
        Cart cart = cartService.addToCart(productId, quantity);
        return ResponseEntity.ok(convertToDTO(cart));
    }

    @PutMapping("/update")
    public ResponseEntity<CartDTO> updateQuantity(
        @RequestParam Long productId,
        @RequestParam Integer quantity
    ) {
        Cart cart = cartService.updateQuantity(productId, quantity);
        return ResponseEntity.ok(convertToDTO(cart));
    }

    @DeleteMapping("/remove")
    public ResponseEntity<CartDTO> removeFromCart(@RequestParam Long productId) {
        Cart cart = cartService.removeFromCart(productId);
        return ResponseEntity.ok(convertToDTO(cart));
    }

    @PostMapping("/checkout")
    public ResponseEntity<Order> checkout(@RequestBody OrderDTO orderDTO) {
        return ResponseEntity.ok(cartService.checkout(orderDTO));
    }
}
