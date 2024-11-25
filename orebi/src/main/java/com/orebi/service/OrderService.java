package com.orebi.service;

import com.orebi.entity.Order;
import com.orebi.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderService {
    @Autowired
    private OrderRepository orderRepository;

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
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
}
