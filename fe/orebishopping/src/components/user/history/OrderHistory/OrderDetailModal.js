import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Table } from "react-bootstrap";
import 'bootstrap/dist/css/bootstrap.min.css';
import './OrderDetailModal.css'; // Import CSS riêng cho modal
import BankingModal from "../../../../pages/payment/Banking/BankingModal"; // Import BankingModal

const OrderDetailModal = ({ orderId, isOpen, onClose }) => {
  const [orderData, setOrderData] = useState(null); // Store the order data
  const [loading, setLoading] = useState(true); // Loading state for fetching order details
  const [error, setError] = useState(null); // Error state for handling API errors
  const [bankingInfo, setBankingInfo] = useState(null); // Store banking info
  const [billImage, setBillImage] = useState(null); // Store uploaded bill image
  const [showBankingModal, setShowBankingModal] = useState(false); // To control the modal visibility

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!orderId) {
        console.log("Không có orderId, không thể fetch dữ liệu.");
        return;
      }

      console.log(`Đang fetch chi tiết cho đơn hàng ID: ${orderId}`);
      
      try {
        const token = localStorage.getItem("authToken");
        const response = await axios.get(
          `http://127.0.0.1:8080/api/orders/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        console.log("Dữ liệu chi tiết đơn hàng nhận được: ", response.data);
        
        setOrderData(response.data); // Set the order data when fetched
        setLoading(false);
      } catch (err) {
        console.log("Lỗi khi gọi API: ", err);
        setError("Lỗi khi lấy chi tiết đơn hàng.");
        setLoading(false);
      }
    };

    fetchOrderDetails();
  }, [orderId]); // Fetch order details whenever the orderId changes

  // Hàm lấy thông tin ngân hàng
  const fetchBankingInfo = async () => {
    try {
      const accessToken = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://127.0.0.1:8080/api/payment/banking/info",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      setBankingInfo(response.data); // Lưu thông tin ngân hàng
      setShowBankingModal(true); // Hiển thị modal
      console.log("Thông tin ngân hàng:", response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin ngân hàng:", error);
      alert("Không thể lấy thông tin ngân hàng.");
    }
  };

  // Hàm tải ảnh hóa đơn
  const handleBillUpload = async () => {
    try {
      if (!billImage || !orderId) {
        alert("Vui lòng chọn ảnh hóa đơn và xác nhận đơn hàng!");
        return;
      }

      const formData = new FormData();
      formData.append("bill", billImage);

      const accessToken = localStorage.getItem("authToken");

      const response = await axios.post(
        `http://127.0.0.1:8080/api/payment/banking/upload-bill/${orderId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Upload hóa đơn thành công!");
      console.log("Hóa đơn đã được tải lên:", response.data);

      // Đóng modal sau khi hoàn tất
      setShowBankingModal(false);
    } catch (error) {
      console.error("Lỗi khi tải hóa đơn:", error);
    }
  };

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Hóa Đơn Mua Hàng
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="modal-user-order-body">
        {loading ? (
          <div>Đang tải...</div>
        ) : error ? (
          <div>{error}</div>
        ) : (
          orderData && (
            <div>
              <h5>Thông Tin Đơn Hàng</h5>
              <Table bordered>
                <tbody>
                  <tr>
                    <th>ID Đơn Hàng:</th>
                    <td>{orderData.orderId}</td>
                  </tr>
                  <tr>
                    <th>Ngày Đặt Hàng:</th>
                    <td>{new Date(orderData.orderDate).toLocaleString()}</td>
                  </tr>
                  <tr>
                    <th>Trạng Thái:</th>
                    <td>{orderData.status}</td>
                  </tr>
                  <tr>
                    <th>Phương Thức Thanh Toán:</th>
                    <td>{orderData.paymentMethod}</td>
                  </tr>
                  <tr>
                    <th>Địa Chỉ Giao Hàng:</th>
                    <td>{orderData.shippingAddress}</td>
                  </tr>
                  <tr>
                    <th>Số Điện Thoại:</th>
                    <td>{orderData.phone}</td>
                  </tr>
                  <tr>
                    <th>Tổng Tiền:</th>
                    <td>{orderData.totalPrice} VND</td>
                  </tr>
                </tbody>
              </Table>

              <h5>Chi Tiết Sản Phẩm</h5>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th>Tên Sản Phẩm</th>
                    <th>Giá</th>
                    <th>Số Lượng</th>
                    <th>Tổng Tiền</th>
                  </tr>
                </thead>
                <tbody>
                  {orderData.orderDetails.map((item) => (
                    <tr key={item.orderDetailId}>
                      <td>{item.snapshotProductName}</td>
                      <td>{item.snapshotPrice} VND</td>
                      <td>{item.quantity}</td>
                      <td>{item.totalLineItem} VND</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {orderData.paymentMethod === "BANKING" && orderData.status === "PENDING" && (
                <div>
                  <Button className="btn color-[#411010] btn-success" onClick={fetchBankingInfo}>
                    Tiếp Tục Thanh Toán
                  </Button>
                </div>
              )}
            </div>
          )
        )}
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>

      {/* Hiển thị BankingModal */}
      {showBankingModal && (
        <BankingModal
          bankingInfo={bankingInfo}
          onUploadBill={handleBillUpload}
          onClose={() => setShowBankingModal(false)}
          onChangeBillImage={(e) => setBillImage(e.target.files[0])}
        />
      )}
    </Modal>
  );
};

export default OrderDetailModal;
