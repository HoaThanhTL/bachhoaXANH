import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom"; // Thêm useNavigate
import "./Account.css";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate(); // Khai báo useNavigate
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handlePasswordChange = (e) => {
    setNewPassword(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu không khớp");
      return;
    }

    try {
      const response = await axios.post(`http://127.0.0.1:8080/api/auth/reset-password/${token}`, {
        newPassword,
      });
      setMessage(response.data.message);
      setError("");

      // Chuyển hướng về trang đăng nhập sau khi reset mật khẩu thành công
      setTimeout(() => {
        navigate("/signin"); // Điều hướng đến trang đăng nhập
      }, 1500); // Delay 1.5s để người dùng có thể xem thông báo thành công
    } catch (err) {
      setMessage("");
      setError(err.response.data.message);
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Đặt lại mật khẩu</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Mật khẩu mới"
          value={newPassword}
          onChange={handlePasswordChange}
        />
        <input
          type="password"
          placeholder="Xác nhận mật khẩu"
          value={confirmPassword}
          onChange={handleConfirmPasswordChange}
        />
        <button type="submit">Đặt lại mật khẩu</button>
      </form>
    </div>
  );
};

export default ResetPassword;
