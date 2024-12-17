import React, { useEffect, useState } from "react";
import "./orderModal.css";

const OrderDetailModal = ({ orderId, isOpen, onClose }) => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  const token = localStorage.getItem("authToken");

  const fetchOrderDetails = async () => {
    if (!token) {
      console.error("Không tìm thấy token");
      return;
    }

    try {
      const response = await fetch(`http://127.0.0.1:8080/api/orders/${orderId}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Không thể lấy chi tiết đơn hàng");
      }

      const data = await response.json();
      setOrderDetails(data);
      setLoading(false);
    } catch (error) {
      console.error("Có lỗi khi lấy chi tiết đơn hàng:", error);
      setLoading(false);
    }
  };

  const handleBankingVerification = async (isValid) => {
    if (!orderDetails) return;
    setProcessing(true);

    try {
      const response = await fetch(
        `http://127.0.0.1:8080/api/payment/banking/verify/${orderDetails.orderId}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ valid: isValid }),
        }
      );

      if (!response.ok) {
        throw new Error("Không thể xác nhận thanh toán");
      }

      const updatedOrder = await response.json();
      setOrderDetails(updatedOrder);
      alert(isValid ? "Xác nhận thanh toán thành công!" : "Đã hủy thanh toán.");
    } catch (error) {
      console.error("Có lỗi khi xác nhận thanh toán:", error);
      alert("Có lỗi xảy ra. Vui lòng thử lại.");
    } finally {
      setProcessing(false);
    }
  };

  useEffect(() => {
    if (isOpen && orderId && token) {
      fetchOrderDetails();
    }
  }, [isOpen, orderId, token]);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
  };

  const renderPaymentMethod = (paymentMethod) => {
    switch (paymentMethod) {
      case "BANKING":
        return <p><strong>Phương thức thanh toán:</strong> Chuyển khoản ngân hàng</p>;
      case "CASH":
        return <p><strong>Phương thức thanh toán:</strong> Thanh toán tiền mặt</p>;
      case "VNPAY":
        return <p><strong>Phương thức thanh toán:</strong> VNPAY</p>;
      default:
        return <p><strong>Phương thức thanh toán:</strong> Không xác định</p>;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="order-modal-overlay" onClick={onClose}>
      <div className="order-modal" tabIndex="-1" role="dialog" onClick={(e) => e.stopPropagation()}>
        <div className="order-modal-dialog" role="document">
          <div className="order-modal-content">
            <div className="order-modal-header">
              <h5 className="order-modal-title">Chi tiết đơn hàng #{orderDetails?.orderId}</h5>
              <button type="button" className="order-close" onClick={onClose} aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="order-modal-body">
              {loading ? (
                <div>Loading...</div>
              ) : (
                orderDetails && (
                  <div className="order-modal-content-details">
                    <p><strong>Ngày đặt hàng:</strong> {formatDate(orderDetails.orderDate)}</p>
                    <p><strong>Trạng thái:</strong> {orderDetails.status}</p>
                    {renderPaymentMethod(orderDetails.paymentMethod)}
                    <p><strong>Địa chỉ giao hàng:</strong> {orderDetails.shippingAddress}</p>
                    <p><strong>Số điện thoại:</strong> {orderDetails.phone}</p>
                    <p><strong>Tổng giá trị:</strong> {orderDetails.totalPrice.toLocaleString()} VND</p>
                    <p><strong>Ghi chú thanh toán:</strong> {orderDetails.paymentNote || "Không có ghi chú"}</p>
                    {orderDetails.paymentMethod === "VNPAY" && (
                      <p><strong>VNPAY Transaction No:</strong> {orderDetails.vnpayTransactionNo || "Không có thông tin"}</p>
                    )}
                    {orderDetails.paymentMethod === "BANKING" && orderDetails.bankTransferImage && (
                      <div>
                        <h3>Ảnh xác nhận chuyển khoản:</h3>
                        <img
                          src={orderDetails.bankTransferImage}
                          alt="Ảnh xác nhận chuyển khoản"
                          style={{ maxWidth: "100%", borderRadius: "8px" }}
                        />
                      </div>
                    )}
                    <h3>Chi tiết sản phẩm:</h3>
                    <table>
                      <thead>
                        <tr>
                          <th>Tên sản phẩm</th>
                          <th>Giá</th>
                          <th>Số lượng</th>
                          <th>Tổng cộng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orderDetails.orderDetails?.map((item) => (
                          <tr key={item.orderDetailId}>
                            <td>
                              <img src={item.snapshotProductImage} alt={item.snapshotProductName} width="50" />
                              {item.snapshotProductName}
                            </td>
                            <td>{item.snapshotPrice.toLocaleString()} VND</td>
                            <td>{item.quantity}</td>
                            <td>{item.totalLineItem.toLocaleString()} VND</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )
              )}
            </div>
            <div className="order-modal-footer">
              {orderDetails?.paymentMethod === "BANKING" &&
                orderDetails.bankTransferImage &&
                !orderDetails.paid && (
                  <>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleBankingVerification(true)}
                      disabled={processing}
                    >
                      Xác nhận
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleBankingVerification(false)}
                      disabled={processing}
                    >
                      Hủy
                    </button>
                  </>
                )}
              <button type="button" className="btn btn-secondary" onClick={onClose}>
                Đóng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailModal;
