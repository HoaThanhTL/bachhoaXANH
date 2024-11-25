// src/components/user/history/OrderHistory/OrderHistory.js

import React, { useState } from "react";
import "./OrderHistory.css"; // Đảm bảo có file CSS riêng cho Order History

const OrderHistory = ({ orderHistory }) => {
  const [selectedOrder, setSelectedOrder] = useState(null); // Quản lý đơn hàng đã chọn để xem chi tiết

  // Hiển thị chi tiết đơn hàng
  const handleViewDetails = (orderId) => {
    const order = orderHistory.find((order) => order.orderId === orderId);
    setSelectedOrder(order);
  };

  return (
    <div className="order-history-container">
      <h2>Order History</h2>

      {/* Bảng lịch sử đơn hàng */}
      <table className="order-history-table">
        <thead>
          <tr>
            <th>Order ID</th>
            <th>Date</th>
            <th>Status</th>
            <th>Total</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {orderHistory.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{order.date}</td>
              <td>{order.status}</td>
              <td>${order.total.toFixed(2)}</td>
              <td>
                <button
                  className="btn-details"
                  onClick={() => handleViewDetails(order.orderId)}
                >
                  View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Hiển thị chi tiết đơn hàng nếu có */}
      {selectedOrder && (
        <div className="order-details">
          <h3>Order Details for {selectedOrder.orderId}</h3>
          <table className="order-details-table">
            <thead>
              <tr>
                <th>Product Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {selectedOrder.items.map((item, index) => (
                <tr key={index}>
                  <td>{item.productName}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price.toFixed(2)}</td>
                  <td>${(item.quantity * item.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <button className="btn-close" onClick={() => setSelectedOrder(null)}>
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
