package com.orebi.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.orebi.entity.Order;

public interface OrderRepository extends JpaRepository<Order, Long> {
}
