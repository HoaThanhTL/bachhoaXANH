package com.orebi.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orebi.dto.OrderDTO;
import com.orebi.dto.OrderDetailDTO;
import com.orebi.dto.ProductSnapshotDTO;
import com.orebi.entity.Order;
import com.orebi.entity.OrderDetail;
import com.orebi.entity.OrderStatus;
import com.orebi.repository.OrderRepository;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<OrderDTO> getAllOrders() {
        return orderRepository.findAll().stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private OrderDTO convertToDTO(Order order) {
        OrderDTO dto = new OrderDTO();
        dto.setOrderId(order.getOrderId());
        dto.setOrderDate(order.getOrderDate());
        dto.setStatus(order.getStatus());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhone(order.getPhone());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setPaid(order.getIsPaid());
        dto.setNote(order.getNote());
        dto.setCreatedAt(order.getCreatedAt());
        dto.setUpdatedAt(order.getUpdatedAt());
        
        // Convert order details
        dto.setOrderDetails(order.getOrderDetails().stream()
            .map(this::convertToDetailDTO)
            .collect(Collectors.toList()));
        
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setBankTransferImage(order.getBankTransferImage());
        dto.setPaymentNote(order.getPaymentNote());
        dto.setVnpayTransactionNo(order.getVnpayTransactionNo());
        
        return dto;
    }

    private OrderDetailDTO convertToDetailDTO(OrderDetail detail) {
        OrderDetailDTO dto = new OrderDetailDTO();
        dto.setOrderDetailId(detail.getOrderDetailId());
        dto.setOrderId(detail.getOrder().getOrderId());
        
        // Convert product snapshot
        ProductSnapshotDTO snapshot = new ProductSnapshotDTO();
        snapshot.setProductId(detail.getProductId());
        snapshot.setName(detail.getProductName());
        snapshot.setImage(detail.getProductImage());
        snapshot.setPrice(detail.getPrice());
        
        dto.setProductSnapshot(snapshot);
        dto.setQuantity(detail.getQuantity());
        dto.setTotalLineItem(detail.getTotalLineItem());
        
        return dto;
    }

    public Optional<OrderDTO> getOrderById(Long id) {
        return orderRepository.findById(id)
            .map(this::convertToDTO);
    }

    public Order createOrder(Order order) {
        order.setCreatedAt(LocalDateTime.now());
        order.setStatus(OrderStatus.PENDING);
        order.setUpdatedAt(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Optional<OrderDTO> updateOrderStatus(Long orderId, OrderStatus status) {
        return orderRepository.findById(orderId)
            .map(order -> {
                order.setStatus(status);
                order.setUpdatedAt(LocalDateTime.now());
                return convertToDTO(orderRepository.save(order));
            });
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUser_UserIdOrderByOrderDateDesc(userId).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<OrderDTO> getOrdersByStatus(OrderStatus status) {
        return orderRepository.findByStatus(status).stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    // Thống kê
    public Map<String, Object> getOrderStatistics() {
        Map<String, Object> stats = new HashMap<>();
        stats.put("totalOrders", orderRepository.count());
        stats.put("totalRevenue", orderRepository.calculateTotalRevenue());
        stats.put("ordersByStatus", orderRepository.countByStatus());
        return stats;
    }

    public Long countOrdersByDate(String dateStr) {
        LocalDate date = LocalDate.parse(dateStr); // Format: yyyy-MM-dd
        LocalDateTime startOfDay = date.atStartOfDay();
        LocalDateTime endOfDay = date.atTime(23, 59, 59);
        return orderRepository.countByOrderDateBetween(startOfDay, endOfDay);
    }

    public Order getOrderEntityById(Long id) {
        return orderRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn hàng"));
    }

    public OrderDTO saveOrder(Order order) {
        order.setUpdatedAt(LocalDateTime.now());
        return convertToDTO(orderRepository.save(order));
    }

    public OrderDTO cancelOrder(Long orderId, String reason) {
        Order order = getOrderEntityById(orderId);
        
        // Kiểm tra điều kiện hủy
        if (!canCancel(order)) {
            throw new RuntimeException("Không thể hủy đơn hàng này");
        }
        
        // Cập nhật trạng thái
        order.setStatus(OrderStatus.CANCELLED);
        order.setNote(reason);
        order.setUpdatedAt(LocalDateTime.now());
        
        return convertToDTO(orderRepository.save(order));
    }

    private boolean canCancel(Order order) {
        // Chỉ hủy được đơn PENDING hoặc PENDING_PAYMENT
        return order.getStatus() == OrderStatus.PENDING || 
               order.getStatus() == OrderStatus.PENDING_PAYMENT;
    }
}
