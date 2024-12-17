package com.orebi.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.orebi.dto.OrderDetailDTO;
import com.orebi.service.OrderService;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {
    @Autowired
    private OrderService orderService;

    @GetMapping("/order/{orderId}")
    public ResponseEntity<List<OrderDetailDTO>> getOrderDetailsByOrderId(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId)
            .map(orderDTO -> ResponseEntity.ok(orderDTO.getOrderDetails()))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderDetailById(@PathVariable Long orderId, @PathVariable Long id) {
        return orderService.getOrderById(orderId)
            .map(orderDTO -> orderDTO.getOrderDetails().stream()
                .filter(detail -> detail.getOrderDetailId().equals(id))
                .findFirst()
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build()))
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<List<OrderDetailDTO>> getOrderDetailsByProductId(@PathVariable Long productId) {
        List<OrderDetailDTO> details = orderService.getAllOrders().stream()
            .flatMap(order -> order.getOrderDetails().stream())
            .filter(detail -> detail.getSnapshotProductId().equals(productId))
            .collect(Collectors.toList());
        
        return ResponseEntity.ok(details);
    }
}
