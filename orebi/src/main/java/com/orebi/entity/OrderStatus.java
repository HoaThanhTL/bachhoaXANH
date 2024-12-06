package com.orebi.entity;

public enum OrderStatus {
    PENDING_PAYMENT,    // Chờ thanh toán
    PAYMENT_FAILED,     // Thanh toán thất bại
    PENDING,           // Chờ xác nhận (đã thanh toán hoặc COD)
    CONFIRMED,         // Đã xác nhận
    SHIPPING,          // Đang giao hàng
    COMPLETED,         // Hoàn thành
    CANCELLED          // Đã hủy
}