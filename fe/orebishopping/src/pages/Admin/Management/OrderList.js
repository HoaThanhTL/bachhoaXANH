import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Pagination from "../../../components/admin/Pagination";  // Import Pagination component
import OrderDetailModal from "../Actions/Order/OrderDetailModal";  // Import OrderDetailModal component

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10); // Default rows per page is 10
  const [selectedOrderId, setSelectedOrderId] = useState(null); // Store selected orderId for modal
  const token = localStorage.getItem("authToken");

  useEffect(() => {
    setLoading(true);
    fetch("http://127.0.0.1:8080/api/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setOrders(data);
        setFilteredOrders(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
        setLoading(false);
        toast.error("Lỗi khi tải danh sách đơn hàng.");
      });
  }, []);

  const handleSearch = (e) => {
    const searchValue = e.target.value.toLowerCase();
    setSearchTerm(searchValue);
    const filtered = orders.filter((order) =>
      Object.values(order).some((value) =>
        value && value.toString().toLowerCase().includes(searchValue)
      )
    );
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleFilterByStatus = (e) => {
    const status = e.target.value;
    setSelectedStatus(status);
    const filtered = status
      ? orders.filter((order) => order.status === status)
      : orders;
    setFilteredOrders(filtered);
    setCurrentPage(1);
  };

  const handleRowsPerPageChange = (e) => {
    setRowsPerPage(Number(e.target.value));
    setCurrentPage(1); // Reset to the first page
  };

  const indexOfLastOrder = currentPage * rowsPerPage;
  const indexOfFirstOrder = indexOfLastOrder - rowsPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);

  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleViewOrderDetails = (orderId) => {
    setSelectedOrderId(orderId);
  };

  const handleCloseModal = () => {
    setSelectedOrderId(null);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order Management</h1>

      {/* Search and filter */}
      <div className="flex mb-4 gap-4">
        <input
          type="text"
          placeholder="Search orders"
          value={searchTerm}
          onChange={handleSearch}
          className="border p-2 rounded w-1/3"
        />
        <select
          value={selectedStatus}
          onChange={handleFilterByStatus}
          className="border p-2 rounded w-1/3"
        >
          <option value="">--Filter by Status--</option>
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
          <option value="10">10 rows</option>
          <option value="20">20 rows</option>
          <option value="50">50 rows</option>
        </select>
      </div>

      {/* Order list table */}
      <table className="min-w-full table-auto border-collapse">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-4 py-2 text-left">Order ID</th>
            <th className="px-4 py-2 text-left">Order Date</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Payment Method</th>
            <th className="px-4 py-2 text-left">Shipping Address</th>
            <th className="px-4 py-2 text-left">Phone</th>
            <th className="px-4 py-2 text-left">Total Price</th>
            <th className="px-4 py-2 text-left">Action</th>
          </tr>
        </thead>
        <tbody>
          {currentOrders.map((order) => (
            <tr key={order.orderId}>
              <td className="border px-4 py-2">{order.orderId}</td>
              <td className="border px-4 py-2">{order.orderDate}</td>
              <td className="border px-4 py-2">{order.status}</td>
              <td className="border px-4 py-2">{order.paymentMethod}</td>
              <td className="border px-4 py-2">{order.shippingAddress}</td>
              <td className="border px-4 py-2">{order.phone}</td>
              <td className="border px-4 py-2">{order.totalPrice.toLocaleString()} VND</td>
              <td className="border px-4 py-2">
                <button
                  onClick={() => handleViewOrderDetails(order.orderId)}
                  className="text-blue-500"
                >
                  View Details
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

      {/* Modal to show order details */}
      <OrderDetailModal
        orderId={selectedOrderId}
        isOpen={selectedOrderId !== null}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default OrderList;
