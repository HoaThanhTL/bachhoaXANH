import React from 'react';
import Sidebar from './Sidebar';
import AdminHeader from './AdminHeader';
import { Outlet } from 'react-router-dom';
import '../../styles/MainLayout.css'; // Đảm bảo đã import CSS

const MainLayout = () => {
  return (
    <div className="admin-layout">
      <Sidebar /> {/* Sidebar chứa các menu điều hướng */}
      <div className="main-content">
        <AdminHeader /> {/* Header chứa thông tin và chức năng điều khiển */}
        <div className="content-area">
          <Outlet /> {/* Nội dung của từng trang con sẽ được hiển thị tại đây */}
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
