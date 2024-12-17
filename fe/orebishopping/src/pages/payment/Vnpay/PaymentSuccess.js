import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import './PaymentSuccess.css'; // Đảm bảo bạn đã import CSS đúng

const PaymentSuccess = () => {
  const [orderDetails, setOrderDetails] = useState(null);
  const [orderInfo, setOrderInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy orderId từ URL
  const location = useLocation();
  const orderId = new URLSearchParams(location.search).get('orderId');

  // Lấy token từ localStorage
  const token = localStorage.getItem('authToken');

  useEffect(() => {
    if (orderId) {
      // Gọi API lấy chi tiết đơn hàng kèm theo token
      axios
        .get(`http://127.0.0.1:8080/api/orders/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`, // Gửi token trong header Authorization
          },
        })
        .then(response => {
          setOrderInfo(response.data); // Lưu thông tin đơn hàng chính
          setLoading(false);
        })
        .catch(err => {
          setError('Có lỗi xảy ra khi lấy dữ liệu');
          setLoading(false);
        });

      // Gọi API lấy chi tiết sản phẩm trong đơn hàng
      axios
        .get(`http://127.0.0.1:8080/api/order-details/order/${orderId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then(response => {
          setOrderDetails(response.data); // Lưu chi tiết sản phẩm trong đơn hàng
          setLoading(false);
        })
        .catch(err => {
          setError('Có lỗi xảy ra khi lấy chi tiết sản phẩm');
          setLoading(false);
        });
    }
  }, [orderId, token]);

  // Hiển thị loading nếu đang lấy dữ liệu
  if (loading) {
    return <div>Đang tải...</div>;
  }

  // Hiển thị lỗi nếu có lỗi xảy ra
  if (error) {
    return <div>{error}</div>;
  }

  // Hiển thị chi tiết đơn hàng nếu có
  return (
    <div className="payment-success-container">
      <h2>Chi tiết đơn hàng</h2>
      {orderInfo ? (
        <div className="payment-details">
          <p><strong>Order ID:</strong> {orderInfo.orderId}</p>
          <p><strong>Ngày đặt hàng:</strong> {new Date(orderInfo.orderDate).toLocaleString()}</p>
          <p><strong>Tổng tiền:</strong> {orderInfo.totalPrice.toLocaleString()} VND</p>
          <p><strong>Phương thức thanh toán:</strong> {orderInfo.paymentMethod}</p>
          <p><strong>Địa chỉ giao hàng:</strong> {orderInfo.shippingAddress}</p>
          <p><strong>Thông tin thanh toán:</strong> {orderInfo.paymentNote}</p>

          <h3>Chi tiết sản phẩm</h3>
          {orderDetails && orderDetails.length > 0 ? (
            <div className="product-list">
              {orderDetails.map(product => (
                <div key={product.orderDetailId} className="product-item">
                  <img src={product.snapshotProductImage} alt={product.snapshotProductName} width="100" />
                  <div>
                    <p><strong>Sản phẩm:</strong> {product.snapshotProductName}</p>
                    <p><strong>Giá:</strong> {product.snapshotPrice.toLocaleString()} VND</p>
                    <p><strong>Số lượng:</strong> {product.quantity}</p>
                    <p><strong>Tổng tiền:</strong> {product.totalLineItem.toLocaleString()} VND</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p>Không có sản phẩm trong đơn hàng này.</p>
          )}

          <footer>
            <Link to="/cart">
              <button>Quay lại giỏ hàng</button>
            </Link>
            <Link to="/shop">
              <button>Tiếp tục mua sắm</button>
            </Link>
          </footer>
        </div>
      ) : (
        <p>Không có dữ liệu đơn hàng.</p>
      )}
    </div>
  );
};

export default PaymentSuccess;
