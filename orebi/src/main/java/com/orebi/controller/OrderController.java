package com.orebi.controller;

import com.orebi.dto.OrderDTO;
import com.orebi.entity.Order;
import com.orebi.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    @Autowired
    private OrderService orderService;

    @GetMapping
    public List<OrderDTO> getAllOrders() {
        return orderService.getAllOrders().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDTO> getOrderById(@PathVariable Long id) {
        return orderService.getOrderById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderDTO createOrder(@RequestBody OrderDTO orderDTO) {
        Order order = convertToEntity(orderDTO);
        Order createdOrder = orderService.createOrder(order);
        return convertToDTO(createdOrder);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDTO> updateOrder(@PathVariable Long id, @RequestBody OrderDTO orderDTO) {
        return orderService.updateOrder(id, convertToEntity(orderDTO))
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrder(@PathVariable Long id) {
        orderService.deleteOrder(id);
        return ResponseEntity.noContent().build();
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setUserId(order.getUser().getUserId());
        dto.setOrderDate(order.getDate());
        return dto;
    }

    private Order convertToEntity(OrderDTO orderDTO) {
        Order order = new Order();
        order.setOrderId(orderDTO.getOrderId());
        // Set User entity based on ID
        return order;
    }
}
