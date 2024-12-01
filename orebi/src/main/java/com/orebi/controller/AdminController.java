package com.orebi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orebi.dto.OrderDTO;
import com.orebi.dto.ProductDTO;
import com.orebi.entity.OrderStatus;
import com.orebi.entity.SubCategory;
import com.orebi.entity.User;
import com.orebi.service.OrderService;
import com.orebi.service.ProductService;
import com.orebi.service.SubCategoryService;
import com.orebi.service.UserService;
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

    @Autowired
    private SubCategoryService subCategoryService;

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
        return orderService.updateOrderStatus(orderId, OrderStatus.valueOf(status.get("status")))
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

    // Quản lý SubCategory
    @GetMapping("/categories/{categoryId}/subcategories")
    public List<SubCategory> getSubCategoriesByCategory(@PathVariable Long categoryId) {
        return subCategoryService.getSubCategoriesByCategoryId(categoryId);
    }

    @PostMapping("/categories/{categoryId}/subcategories")
    public SubCategory createSubCategory(
            @PathVariable Long categoryId,
            @RequestBody SubCategory subCategory) {
        return subCategoryService.createSubCategory(categoryId, subCategory);
    }

    @PutMapping("/categories/{categoryId}/subcategories/{subCategoryId}")
    public ResponseEntity<SubCategory> updateSubCategory(
            @PathVariable Long categoryId,
            @PathVariable Long subCategoryId,
            @RequestBody SubCategory subCategory) {
        return subCategoryService.updateSubCategory(categoryId, subCategoryId, subCategory)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/categories/{categoryId}/subcategories/{subCategoryId}")
    public ResponseEntity<?> deleteSubCategory(
            @PathVariable Long categoryId,
            @PathVariable Long subCategoryId) {
        subCategoryService.deleteSubCategory(subCategoryId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/orders/statistics")
    public Map<String, Object> getOrderStatistics() {
        return orderService.getOrderStatistics();
    }

    @GetMapping("/orders/status/{status}")
    public List<OrderDTO> getOrdersByStatus(@PathVariable OrderStatus status) {
        return orderService.getOrdersByStatus(status);
    }
}