package com.orebi.service;

import com.orebi.entity.OrderDetail;
import com.orebi.repository.OrderDetailRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class OrderDetailService {
    @Autowired
    private OrderDetailRepository orderDetailRepository;

    public List<OrderDetail> getAllOrderDetails() {
        return orderDetailRepository.findAll();
    }

    public Optional<OrderDetail> getOrderDetailById(Long id) {
        return orderDetailRepository.findById(id);
    }

    public OrderDetail createOrderDetail(OrderDetail orderDetail) {
        return orderDetailRepository.save(orderDetail);
    }

    public Optional<OrderDetail> updateOrderDetail(Long id, OrderDetail orderDetail) {
        if (orderDetailRepository.existsById(id)) {
            orderDetail.setOrderDetailId(id);
            return Optional.of(orderDetailRepository.save(orderDetail));
        }
        return Optional.empty();
    }

    public void deleteOrderDetail(Long id) {
        orderDetailRepository.deleteById(id);
    }
}
