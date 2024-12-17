import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom"; // Để lấy email từ bước trước
import axios from "axios";
import "./Account.css";

const OtpPage = () => {
  const [otp, setOtp] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây

  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email; // Lấy email từ bước đăng ký (truyền qua navigate)

  // Đồng hồ đếm ngược
  useEffect(() => {
    if (timeLeft > 0) {
      const interval = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);

      return () => clearInterval(interval); // Dọn dẹp interval khi component bị unmount
    }
  }, [timeLeft]);

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

  // Hàm chuyển đổi giây thành phút và giây
  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <div className="otp-page">
      <h1>Nhập mã OTP</h1>
      {error && <p className="error">{error}</p>}
      {message && <p className="message">{message}</p>}

      <div className="otp-form">
        <label htmlFor="otp">Mã OTP:</label>
        <input
          type="text"
          id="otp"
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Nhập mã OTP"
        />
      </div>

      <button onClick={handleVerify} disabled={timeLeft <= 0}>
        Xác thực OTP
      </button>

      {timeLeft > 0 ? (
        <p className="countdown">Thời gian còn lại: {formatTime(timeLeft)}</p>
      ) : (
        <p className="expired">Mã OTP đã hết hạn</p>
      )}
    </div>
  );
};

export default OtpPage;
