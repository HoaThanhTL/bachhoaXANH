package com.orebi.dto;

import java.time.LocalDateTime;
import java.util.List;

import com.orebi.entity.OrderStatus;
import com.orebi.entity.PaymentMethod;

public class OrderDTO {
    private List<Long> selectedLineItemIds;
    private Long orderId;
    private LocalDateTime orderDate;
    private OrderStatus status;
    private PaymentMethod paymentMethod;
    private String shippingAddress;
    private String phone;
    private double totalPrice;
    private boolean isPaid;
    private String bankTransferImage;
    private String paymentNote;
    private String vnpayTransactionNo;
    private String note;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private List<OrderDetailDTO> orderDetails;
    private String trackingNumber;
    private double shippingFee;
    private String recipientName;
    private String recipientPhone;
    private boolean valid;

    // Getters/setters
    public Long getOrderId() {
        return orderId;
    }

    public void setOrderId(Long orderId) {
        this.orderId = orderId;
    }

    public LocalDateTime getOrderDate() {
        return orderDate;
    }

    public void setOrderDate(LocalDateTime orderDate) {
        this.orderDate = orderDate;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public PaymentMethod getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(PaymentMethod paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getShippingAddress() {
        return shippingAddress;
    }

    public void setShippingAddress(String shippingAddress) {
        this.shippingAddress = shippingAddress;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public double getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(double totalPrice) {
        this.totalPrice = totalPrice;
    }

    public boolean isPaid() {
        return isPaid;
    }

    public void setPaid(boolean isPaid) {
        this.isPaid = isPaid;
    }

    public String getBankTransferImage() {
        return bankTransferImage;
    }

    public void setBankTransferImage(String bankTransferImage) {
        this.bankTransferImage = bankTransferImage;
    }

    public String getPaymentNote() {
        return paymentNote;
    }

    public void setPaymentNote(String paymentNote) {
        this.paymentNote = paymentNote;
    }

    public String getVnpayTransactionNo() {
        return vnpayTransactionNo;
    }

    public void setVnpayTransactionNo(String vnpayTransactionNo) {
        this.vnpayTransactionNo = vnpayTransactionNo;
    }

    public String getNote() {
        return note;
    }

    public void setNote(String note) {
        this.note = note;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<OrderDetailDTO> getOrderDetails() {
        return orderDetails;
    }

    public void setOrderDetails(List<OrderDetailDTO> orderDetails) {
        this.orderDetails = orderDetails;
    }

    public List<Long> getSelectedLineItemIds() {
        return selectedLineItemIds;
    }

    public void setSelectedLineItemIds(List<Long> selectedLineItemIds) {
        this.selectedLineItemIds = selectedLineItemIds;
    }

    public String getTrackingNumber() {
        return trackingNumber;
    }

    public void setTrackingNumber(String trackingNumber) {
        this.trackingNumber = trackingNumber;
    }

    public double getShippingFee() {
        return shippingFee;
    }

    public void setShippingFee(double shippingFee) {
        this.shippingFee = shippingFee;
    }

    public String getRecipientName() {
        return recipientName;
    }

    public void setRecipientName(String recipientName) {
        this.recipientName = recipientName;
    }

    public String getRecipientPhone() {
        return recipientPhone;
    }

    public void setRecipientPhone(String recipientPhone) {
        this.recipientPhone = recipientPhone;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }
}
