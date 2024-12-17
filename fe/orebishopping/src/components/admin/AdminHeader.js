import React from 'react';
import { FaBell, FaUserCircle } from 'react-icons/fa';  // Import icon từ react-icons
import '../../styles/AdminHeader.css';

const AdminHeader = () => {
  return (
    <div className="admin-header">
      <div className="header-left">
        <h2>MINH THUC - TIEN PHUONG</h2>
      </div>
      <div className="header-right">
        <div className="notifications">
          <FaBell size={24} /> {/* Thay emoji bằng icon Bell */}
        </div>
        <div className="user-profile">
          <FaUserCircle size={30} /> {/* Thay emoji bằng icon User */}
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
