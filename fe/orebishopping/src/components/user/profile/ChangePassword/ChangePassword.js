// src/components/user/profile/ChangePassword/ChangePassword.js
import React, { useState } from 'react';
import './ChangePassword.css'; // Import CSS cho giao diện đẹp mắt

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  // Hàm kiểm tra mật khẩu hợp lệ
  const validatePasswords = () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Tất cả các trường đều phải được điền.');
      return false;
    }
    if (newPassword !== confirmPassword) {
      setError('Mật khẩu mới và mật khẩu xác nhận không khớp.');
      return false;
    }
    if (newPassword.length < 6) {
      setError('Mật khẩu mới phải có ít nhất 6 ký tự.');
      return false;
    }
    return true;
  };

  // Hàm xử lý thay đổi mật khẩu
  const handleChangePassword = (e) => {
    e.preventDefault();
    setError(''); // Reset lỗi trước khi kiểm tra
    if (validatePasswords()) {
      // Giả sử gọi API thay đổi mật khẩu ở đây
      alert('Thay đổi mật khẩu thành công!');
      // Thực hiện logic thay đổi mật khẩu ở đây
    }
  };

  return (
    <div className="change-password-container">
      <h2>Đổi Mật Khẩu</h2>
      <form onSubmit={handleChangePassword} className="change-password-form">
        {error && <p className="error-message">{error}</p>}
        
        <div className="form-group">
          <label htmlFor="current-password">Mật khẩu hiện tại</label>
          <input
            type="password"
            id="current-password"
            placeholder="Nhập mật khẩu hiện tại"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="new-password">Mật khẩu mới</label>
          <input
            type="password"
            id="new-password"
            placeholder="Nhập mật khẩu mới"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirm-password">Xác nhận mật khẩu mới</label>
          <input
            type="password"
            id="confirm-password"
            placeholder="Xác nhận mật khẩu mới"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <button type="submit" className="submit-btn">Đổi Mật Khẩu</button>
      </form>
    </div>
  );
};

export default ChangePassword;
