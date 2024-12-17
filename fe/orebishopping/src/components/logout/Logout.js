// src/components/user/profile/Logout/Logout.js

import React, { useState } from "react";
import "./Logout.css"; // Import file CSS cho modal và button

const Logout = ({ onLogout }) => {
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Quản lý trạng thái modal
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Quản lý trạng thái đang đăng xuất

  // Hàm hiển thị modal xác nhận đăng xuất
  const handleLogoutClick = () => {
    setShowLogoutModal(true);  // Mở modal xác nhận đăng xuất
  };

  // Xử lý đăng xuất khi người dùng xác nhận
  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true);  // Bắt đầu quá trình đăng xuất
    try {
      const token = localStorage.getItem('authToken');  // Lấy token từ localStorage
      const response = await fetch('http://127.0.0.1:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Gửi token nếu cần
        },
        credentials: 'include',  // Gửi cookie nếu cần thiết
      });

      if (response.ok) {
        localStorage.removeItem('authToken');  // Xóa token khi đăng xuất
        onLogout();  // Gọi callback từ component cha để cập nhật trạng thái
        setShowLogoutModal(false);  // Đóng modal sau khi đăng xuất thành công
      } else {
        console.error('Đăng xuất thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      setIsLoggingOut(false);  // Kết thúc quá trình đăng xuất
    }
  };

  // Hàm hủy đăng xuất
  const handleLogoutCancel = () => {
    setShowLogoutModal(false);  // Đóng modal khi nhấn Cancel
  };

  return (
    <div className="logout-container">
      {/* Nút đăng xuất */}
      <button className="logout-button" onClick={handleLogoutClick}>
        Đăng xuất
      </button>

      {/* Modal xác nhận đăng xuất */}
      {showLogoutModal && (
        <div className="logout-modal">
          <div className="modal-content">
            <p>Bạn muốn kết thúc phiên mua sắm?</p>
            <div className="modal-buttons">
              {/* Nút đồng ý đăng xuất */}
              <button
                onClick={handleLogoutConfirm}
                disabled={isLoggingOut}  // Vô hiệu hóa nút khi đang đăng xuất
                className="confirm-btn"
              >
                {isLoggingOut ? "Đang đăng xuất..." : "Đồng ý"}
              </button>
              {/* Nút hủy */}
              <button onClick={handleLogoutCancel} className="cancel-btn">
                Hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Logout;
