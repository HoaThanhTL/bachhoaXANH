package com.orebi.entity;

public enum OrderStatus {
    PENDING_PAYMENT,    // Chờ thanh toán
    PAYMENT_FAILED,     // Thanh toán thất bại
    PENDING,           // Chờ xác nhận 
    CONFIRMED,         // Đã xác nhận
    COMPLETED,         // Hoàn thành
    CANCELLED          // Đã hủy
}