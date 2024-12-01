package com.orebi.controller;

import com.orebi.dto.OrderDetailDTO;
import com.orebi.entity.OrderDetail;
import com.orebi.service.OrderDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/order-details")
public class OrderDetailController {
    @Autowired
    private OrderDetailService orderDetailService;

    @GetMapping
    public List<OrderDetailDTO> getAllOrderDetails() {
        return orderDetailService.getAllOrderDetails().stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> getOrderDetailById(@PathVariable Long id) {
        return orderDetailService.getOrderDetailById(id)
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderDetailDTO createOrderDetail(@RequestBody OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = convertToEntity(orderDetailDTO);
        OrderDetail createdOrderDetail = orderDetailService.createOrderDetail(orderDetail);
        return convertToDTO(createdOrderDetail);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderDetailDTO> updateOrderDetail(@PathVariable Long id, @RequestBody OrderDetailDTO orderDetailDTO) {
        return orderDetailService.updateOrderDetail(id, convertToEntity(orderDetailDTO))
                .map(this::convertToDTO)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrderDetail(@PathVariable Long id) {
        orderDetailService.deleteOrderDetail(id);
        return ResponseEntity.noContent().build();
    }

    private OrderDetailDTO convertToDTO(OrderDetail orderDetail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderDetailId(orderDetail.getOrderDetailId());
        dto.setOrderId(orderDetail.getOrder().getOrderId());
        dto.setProductId(orderDetail.getProduct().getProductId());
        dto.setQuantity(orderDetail.getQuantity());
        dto.setTotalLineItem(orderDetail.getTotalLineItem());
        return dto;
    }

    private OrderDetail convertToEntity(OrderDetailDTO orderDetailDTO) {
        OrderDetail orderDetail = new OrderDetail();
        orderDetail.setOrderDetailId(orderDetailDTO.getOrderDetailId());
        // Set Order and Product entities based on IDs
        return orderDetail;
    }
}
