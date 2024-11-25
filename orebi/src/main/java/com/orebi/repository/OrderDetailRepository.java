package com.orebi.repository;

import com.orebi.entity.OrderDetail;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderDetailRepository extends JpaRepository<OrderDetail, Long> {
}
