package com.orebi.entity;

public enum OrderStatus {
    PENDING,        // Chờ xác nhận
    CONFIRMED,      // Đã xác nhận
    SHIPPING,       // Đang giao
    DELIVERED,      // Đã giao
    COMPLETED,      // Hoàn thành
    CANCELLED       // Đã hủy
}