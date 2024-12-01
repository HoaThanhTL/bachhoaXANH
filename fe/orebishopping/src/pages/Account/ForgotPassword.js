import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8080/api/auth/forgot-password", {
        email,
      });
      setMessage(response.data.message);
      setError("");
    } catch (err) {
      setMessage("");
      setError(err.response.data.message);
    }
  };

  return (
    <div className="forgot-password-container">
      <h2>Quên mật khẩu</h2>
      {message && <p className="success-message">{message}</p>}
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Nhập email của bạn"
          value={email}
          onChange={handleEmailChange}
        />
        <button type="submit">Gửi yêu cầu reset mật khẩu</button>
      </form>
      <p>
        Quay lại{" "}
        <Link to="/signin">Đăng nhập</Link>
      </p>
    </div>
  );
};

export default ForgotPassword;
