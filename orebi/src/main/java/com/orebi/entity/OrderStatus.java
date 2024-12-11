package com.orebi.entity;

public enum OrderStatus {
    PENDING_PAYMENT,    // Chờ thanh toán
    PAYMENT_FAILED,     // Thanh toán thất bại
    PENDING,           // Chờ xác nhận 
    PAYMENT_SUCCESS,   // Thanh toán thành công
    COMPLETED,         // Hoàn thành
    SHIPPING,          // Đang giao hàng
    CANCELLED          // Đã hủy
}