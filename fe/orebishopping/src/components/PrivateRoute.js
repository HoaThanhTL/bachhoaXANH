import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('authToken'); 
  const role = localStorage.getItem('role'); 

  // Nếu không có token hoặc role không phải là admin, điều hướng đến trang chủ hoặc trang đăng nhập
  if (!token || role !== 'ROLE_ADMIN') {
    return <Navigate to="/" />;  // Điều hướng về trang chủ nếu không phải admin
  }

  // Nếu có token hợp lệ và là admin, cho phép truy cập vào các trang admin
  return <Outlet />;
};

export default PrivateRoute;
