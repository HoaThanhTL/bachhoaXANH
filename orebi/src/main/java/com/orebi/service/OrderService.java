package com.orebi.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.orebi.dto.OrderDTO;
import com.orebi.entity.Order;
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
        dto.setUserId(order.getUser().getUserId());
        dto.setOrderDate(order.getDate());
        dto.setTotalPrice(order.getTotalPrice());
        dto.setPaymentMethod(order.getPaymentMethod());
        dto.setStatus(order.getStatus());
        dto.setShippingAddress(order.getShippingAddress());
        dto.setPhone(order.getPhone());
        return dto;
    }

    public Optional<Order> getOrderById(Long id) {
        return orderRepository.findById(id);
    }

    public Order createOrder(Order order) {
        return orderRepository.save(order);
    }

    public Optional<Order> updateOrder(Long id, Order order) {
        if (orderRepository.existsById(id)) {
            order.setOrderId(id);
            return Optional.of(orderRepository.save(order));
        }
        return Optional.empty();
    }

    public void deleteOrder(Long id) {
        orderRepository.deleteById(id);
    }

    public Optional<OrderDTO> updateOrderStatus(Long orderId, OrderStatus status) {
        return orderRepository.findById(orderId)
            .map(order -> {
                order.setStatus(status);
                return convertToDTO(orderRepository.save(order));
            });
    }

    public Map<String, Object> getSalesStatistics() {
        // Implementation to get sales statistics
        return new HashMap<>();
    }

    public Map<String, Object> getOverviewStatistics() {
        Map<String, Object> stats = new HashMap<>();
        
        // Tổng số đơn hàng
        stats.put("totalOrders", orderRepository.count());
        
        // Tổng doanh thu
        Double totalRevenue = orderRepository.sumTotalPrice();
        stats.put("totalRevenue", totalRevenue != null ? totalRevenue : 0.0);
        
        // Số đơn hàng trong ngày
        LocalDate today = LocalDate.now();
        Long todayOrders = orderRepository.countByDateStartsWith(today.toString());
        stats.put("todayOrders", todayOrders != null ? todayOrders : 0);
        
        return stats;
    }

    public List<Map<String, Object>> getCategorySales() {
        return orderRepository.findCategorySales();
    }

    public List<OrderDTO> getOrdersByUserId(Long userId) {
        return orderRepository.findByUser_UserIdOrderByDateDesc(userId).stream()
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
}
