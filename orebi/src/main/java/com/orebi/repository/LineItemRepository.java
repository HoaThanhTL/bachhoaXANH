package com.orebi.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.orebi.entity.LineItem;

@Repository
public interface LineItemRepository extends JpaRepository<LineItem, Long> {
}
