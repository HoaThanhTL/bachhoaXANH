import React, { useState, useEffect } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import BankingModal from "./Banking/BankingModal"; // Import modal Banking
import "./Payment";

const Payment = () => {
  const location = useLocation();
  const selectedLineItems = location.state?.selectedLineItems || [];

  const [shippingAddress, setShippingAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [note, setNote] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("BANKING");
  const [orderId, setOrderId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [bankingInfo, setBankingInfo] = useState(null);
  const [billImage, setBillImage] = useState(null);
  const [userInfo, setUserInfo] = useState(null);  // User info state

  // Hàm gọi API để lấy thông tin người dùng
  const fetchUserInfo = async () => {
    try {
      const accessToken = localStorage.getItem("authToken");
      const response = await axios.get(
        "http://127.0.0.1:8080/api/users/current",
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const { data } = response;
      setUserInfo(data); // Lưu thông tin người dùng vào state
      setShippingAddress(data.address || "")  // Nếu có giá trị, điền vào form
      setPhone(data.phone || ""); // Điền số điện thoại vào form nếu có
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      alert("Không thể lấy thông tin người dùng.");
    }
  };

  useEffect(() => {
    fetchUserInfo(); // Gọi API khi component được load
  }, []);

  // Hàm gọi API checkout
  const handleCheckout = async () => {
    setLoading(true);
    try {
      const selectedLineItemIds = selectedLineItems.map((item) => item.lineItemId);
      const data = {
        selectedLineItemIds,
        paymentMethod,
        shippingAddress,
        phone,
        note,
      };

      const accessToken = localStorage.getItem("authToken");
      const checkoutResponse = await axios.post(
        "http://127.0.0.1:8080/api/cart/checkout",
        data,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const { orderId: newOrderId } = checkoutResponse.data;
      setOrderId(newOrderId);
      console.log(checkoutResponse);
      alert("Tạo đơn hàng thành công, đang xử lý thanh toán...");

      // Gọi API thanh toán ngay lập tức
      if (paymentMethod === "BANKING") {
        fetchBankingInfo(); // Lấy thông tin ngân hàng
      } else if (paymentMethod === "VNPAY") {
        handleVnPayPayment(newOrderId); // Gọi API thanh toán VNPAY
      }

    } catch (error) {
      console.error("Lỗi khi thanh toán:", error);
      alert("Thanh toán thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  // Hàm tạo thanh toán VNPAY
 // Hàm tạo thanh toán VNPAY
 const handleVnPayPayment = async (id) => {
  try {
    const accessToken = localStorage.getItem("authToken");
    const response = await axios.post(
      `http://127.0.0.1:8080/api/payment/vnpay/create/${id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const { paymentUrl } = response.data;
    console.log("Received VNPAY payment URL:", paymentUrl);

    // Nếu có paymentUrl, chuyển hướng đến URL thanh toán
    if (paymentUrl) {
      window.location.href = paymentUrl;  // Điều hướng đến URL thanh toán
    } else {
      console.error("Không nhận được paymentUrl.");
      alert("Lỗi khi tạo thanh toán VNPAY.");
    }
  } catch (error) {
    console.error("Lỗi khi tạo thanh toán VNPAY:", error);
    alert("Không thể tạo thanh toán VNPAY.");
  }
};


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
      setShowModal(true); // Hiển thị modal
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
      console.log(accessToken);

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

      console.log(response)
      alert("Upload hóa đơn thành công!");
      console.log("Hóa đơn đã được tải lên:", response.data);

      // Đóng modal sau khi hoàn tất
      setShowModal(false);
    } catch (error) {
      console.error("Lỗi khi tải hóa đơn:", error);
    }
  };

  const totalAmount = selectedLineItems.reduce(
    (acc, item) => acc + item.productPrice * item.quantity,
    0
  );

  return (
    <div className="payment-container flex justify-between mt-32">
      {/* Hóa đơn bên trái */}
      <div className="invoice-section w-1/2 p-4 border-r">
        <h1 className="text-2xl font-semibold mb-4">Hóa đơn thanh toán</h1>
        <table className="w-full table-auto mb-4">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 text-left">Tên sản phẩm</th>
              <th className="py-2 px-4 text-left">Số lượng</th>
              <th className="py-2 px-4 text-left">Giá bán</th>
              <th className="py-2 px-4 text-left">Thành tiền</th>
            </tr>
          </thead>
          <tbody>
            {selectedLineItems.map((item) => (
              <tr key={item.lineItemId} className="border-t">
                <td className="py-2 px-4">{item.productName}</td>
                <td className="py-2 px-4">{item.quantity}</td>
                <td className="py-2 px-4">{item.productPrice.toLocaleString()} đ</td>
                <td className="py-2 px-4">
                  {(item.productPrice * item.quantity).toLocaleString()} đ
                </td>
              </tr>
            ))}
            <tr className="font-semibold bg-gray-200">
              <td colSpan="3" className="py-2 px-4 text-right">Tổng cộng:</td>
              <td className="py-2 px-4">{totalAmount.toLocaleString()} đ</td>
            </tr>
          </tbody>
        </table>
</div>
<div className="invoice-section w-1/2 p-4 border-r">
        {/* Địa chỉ giao hàng */}
        <div className="mb-4">
        <label htmlFor="shippingAddress" className="block mb-1">Địa chỉ giao hàng:</label>
        <input
          type="text"
          id="shippingAddress"
          className="w-full p-2 border border-gray-300 rounded"
          value={shippingAddress}
          onChange={(e) => setShippingAddress(e.target.value)} // Cập nhật địa chỉ khi thay đổi
        />
      </div>

        {/* Số điện thoại */}
        <div className="mb-4">
          <label htmlFor="phone" className="block mb-1">Số điện thoại:</label>
          <input
            type="text"
            id="phone"
            className="w-full p-2 border border-gray-300 rounded"
            value={phone || ""}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Ghi chú */}
        <div className="mb-4">
          <label htmlFor="note" className="block mb-1">Ghi chú:</label>
          <textarea
            id="note"
            className="w-full p-2 border border-gray-300 rounded"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>
        </div>

        {/* Phương thức thanh toán */}
        <div className="mb-4">
          <label className="block mb-1">Phương thức thanh toán:</label>
          <select
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded"
          >
            <option value="BANKING">Thanh toán ngân hàng</option>
            <option value="VNPAY">Thanh toán qua VNPAY</option>
            <option value="COD">Thanh toán khi nhận hàng</option>
          </select>
        </div>

        {/* Nút thanh toán */}
        <div className="mt-6 flex justify-between">
          <button
            onClick={handleCheckout}
            className="bg-blue-500 text-white p-2 rounded"
          >
            {loading ? "Đang xử lý..." : "Thanh toán"}
          </button>
        </div>
      </div>


      {/* Sử dụng modal Banking */}
      {showModal && paymentMethod === "BANKING" && (
        <BankingModal
          bankingInfo={bankingInfo}
          onUploadBill={handleBillUpload}
          onClose={() => setShowModal(false)}
          onChangeBillImage={(e) => setBillImage(e.target.files[0])}
        />
      )}
    </div>
  );
};

export default Payment;


