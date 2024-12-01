import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ResetPassword = () => {
  const { token } = useParams();
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
