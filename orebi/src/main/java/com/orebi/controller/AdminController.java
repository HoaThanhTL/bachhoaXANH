package com.orebi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import com.orebi.service.UserService;
import com.orebi.service.ProductService;
import com.orebi.service.OrderService;
import com.orebi.dto.ProductDTO;
import com.orebi.dto.OrderDTO;
import com.orebi.entity.User;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin")
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    @Autowired
    private UserService userService;

    @Autowired
    private ProductService productService;

    @Autowired
    private OrderService orderService;

    // Quản lý người dùng
    @GetMapping("/users")
    public List<User> getAllUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/users/{userId}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long userId, @RequestBody Map<String, String> role) {
        return userService.updateUserRole(userId, role.get("role"))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/users/{userId}")
    public ResponseEntity<?> deleteUser(@PathVariable Long userId) {
        userService.deleteUser(userId);
        return ResponseEntity.ok().build();
    }

    // Quản lý sản phẩm
    @PostMapping("/products")
    public ProductDTO createProduct(@RequestBody ProductDTO productDTO) {
        return productService.createProduct(productDTO);
    }

    @PutMapping("/products/{productId}")
    public ResponseEntity<ProductDTO> updateProduct(@PathVariable Long productId, @RequestBody ProductDTO productDTO) {
        return productService.updateProduct(productId, productDTO)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/products/{productId}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long productId) {
        productService.deleteProduct(productId);
        return ResponseEntity.ok().build();
    }

    // Quản lý đơn hàng
    @GetMapping("/orders")
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders();
    }

    @PutMapping("/orders/{orderId}/status")
    public ResponseEntity<OrderDTO> updateOrderStatus(@PathVariable Long orderId, @RequestBody Map<String, String> status) {
        return orderService.updateOrderStatus(orderId, status.get("status"))
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    // Thống kê
    @GetMapping("/statistics/overview")
    public Map<String, Object> getOverviewStatistics() {
        return orderService.getOverviewStatistics();
    }

    @GetMapping("/statistics/products/top-selling")
    public List<ProductDTO> getTopSellingProducts() {
        return productService.getTopSellingProducts();
    }

    @GetMapping("/statistics/categories/sales")
    public List<Map<String, Object>> getCategorySales() {
        return orderService.getCategorySales();
    }
}