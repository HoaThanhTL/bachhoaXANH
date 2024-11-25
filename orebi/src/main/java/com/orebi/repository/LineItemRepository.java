package com.orebi.repository;

import com.orebi.entity.LineItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface LineItemRepository extends JpaRepository<LineItem, Long> {
}
