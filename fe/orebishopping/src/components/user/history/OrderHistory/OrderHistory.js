import React, { useState, useEffect } from "react";
import axios from "axios";
import Pagination from "../../../admin/Pagination"; // Import Pagination component
import OrderDetailModal from "./OrderDetailModal";  // Import OrderDetailModal component
import "./OrderHistory.css"; // Ensure you have a separate CSS file for styling

const OrderHistory = () => {
  const [orderHistory, setOrderHistory] = useState([]); // Manage the list of orders
  const [filteredOrders, setFilteredOrders] = useState([]); // Manage filtered orders
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Track the selected order ID
  const [loading, setLoading] = useState(true); // Manage loading state
  const [error, setError] = useState(null); // Handle error state
  const [searchTerm, setSearchTerm] = useState(""); // For search functionality
  const [selectedStatus, setSelectedStatus] = useState(""); // For status filter
  const [currentPage, setCurrentPage] = useState(1); // Current page for pagination
  const [rowsPerPage, setRowsPerPage] = useState(5); // Rows per page for pagination

  const getToken = () => localStorage.getItem("authToken");
  const getUserId = () => localStorage.getItem("userId");

  useEffect(() => {
    const fetchOrderHistory = async () => {
      const userId = getUserId();
      if (!userId) {
        setError("Không tìm thấy người dùng. Vui lòng đăng nhập.");
        setLoading(false);
        return;
      }

      try {
        const token = getToken();
        const response = await axios.get(
          `http://127.0.0.1:8080/api/orders/user/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setOrderHistory(response.data);
        setFilteredOrders(response.data);
        setLoading(false);
      } catch (err) {
        setError("Lỗi khi lấy lịch sử đơn hàng.");
        setLoading(false);
      }
    };

    fetchOrderHistory();
  }, []);

  const formatCurrency = (value) => {
    return value && !isNaN(value) ? `${value.toFixed(0)} VND` : "0 VND";
  };

  const handleViewDetails = async (orderId) => {
    setSelectedOrderId(orderId); // Lưu orderId khi người dùng chọn một đơn hàng
  };

  // Search handling
  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = orderHistory.filter((order) =>
      Object.values(order).some((value) =>
        value && value.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to page 1 when search term changes
  };

  // Filter by status handling
  const handleFilterByStatus = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    const filtered = status
      ? orderHistory.filter((order) => order.status === status)
      : orderHistory;
    setFilteredOrders(filtered);
    setCurrentPage(1); // Reset to page 1 when filter changes
  };

  // Rows per page handling
  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to page 1 when rows per page changes
  };

  // Pagination logic
  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  if (loading) {
    return <div>Đang tải...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="order-history-container">
      <h2>Lịch sử đơn hàng</h2>

      {/* Search and filter */}
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Tìm kiếm đơn hàng"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-1/3"
        />
        <select
          value={selectedStatus}
          onChange={handleFilterByStatus}
          className="border p-2 rounded w-1/3"
        >
          <option value="">--Lọc theo trạng thái--</option>
          <option value="PENDING_PAYMENT">PENDING_PAYMENT</option>
          <option value="PAYMENT_FAILED">PAYMENT_FAILED</option>
          <option value="PENDING">PENDING</option>
          <option value="PAYMENT_SUCCESS">PAYMENT_SUCCESS</option>
          <option value="COMPLETED">COMPLETED</option>
          <option value="SHIPPING">SHIPPING</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
        <select
          value={rowsPerPage}
          onChange={handleRowsPerPageChange}
          className="border p-2 rounded w-1/3"
        >
          <option value="5">5 rows</option>
          <option value="10">10 rows</option>
          <option value="20">20 rows</option>
        </select>
      </div>

      {/* Table of order history */}
      <table className="order-history-table">
        <thead>
          <tr>
            <th>ID Đơn Hàng</th>
            <th>Ngày</th>
            <th>Trạng Thái</th>
            <th>Tổng Tiền</th>
            <th>Hành Động</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.orderId}>
              <td>{order.orderId}</td>
              <td>{new Date(order.orderDate).toLocaleString()}</td>
              <td>{order.status}</td>
              <td>{formatCurrency(order.totalPrice)}</td>
              <td>
                <button
                  className="btn-details"
                  onClick={() => handleViewDetails(order.orderId)}
                >
                  Xem Chi Tiết
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      {/* Show Modal if selectedOrderId is set */}
      {selectedOrderId && (
        <>
          {console.log("orderId được truyền vào modal: ", selectedOrderId)} {/* Kiểm tra giá trị orderId */}
          <OrderDetailModal
            orderId={selectedOrderId} // Truyền orderId từ selectedOrderId vào modal
            isOpen={true} // Đảm bảo modal mở khi có selectedOrderId
            onClose={() => setSelectedOrderId(null)} // Đóng modal khi set selectedOrderId là null
          />
        </>
      )}
    </div>
  );
};

export default OrderHistory;
