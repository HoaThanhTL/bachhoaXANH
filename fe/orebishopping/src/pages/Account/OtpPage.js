import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Để lấy email từ bước trước
import axios from "axios";

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Lấy email từ bước đăng ký (truyền qua navigate)

  const handleVerify = async () => {
    if (!email) {
      setError("Không tìm thấy email. Vui lòng quay lại bước đăng ký.");
      return;
    }

    try {
      const response = await axios.post("http://127.0.0.1:8080/api/auth/verify-otp", {
        email,
        otp,
      });

      if (response.status === 200) {
        setMessage(response.data.message); // Hiển thị "Xác thực OTP thành công"
        setTimeout(() => {
          navigate("/signin"); // Chuyển đến trang đăng nhập sau khi xác thực thành công
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Xác thực OTP thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div>
      <h1>Nhập mã OTP</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {message && <p style={{ color: "green" }}>{message}</p>}

      <div>
        <label htmlFor="otp">Mã OTP:</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Nhập mã OTP"
        />
      </div>

      <button onClick={handleVerify}>Xác thực OTP</button>
    </div>
  );
};

export default OtpPage;
