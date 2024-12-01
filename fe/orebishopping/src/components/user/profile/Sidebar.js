import React from "react";
import "./Sidebar.css";

const Sidebar = ({ setSelectedTab }) => {
  return (
    <ul className="sidebar-menu">
      <li onClick={() => setSelectedTab("profile")}>Thông tin cá nhân</li>
      <li onClick={() => setSelectedTab("editProfile")}>Chỉnh sửa thông tin</li>
      <li onClick={() => setSelectedTab("offers")}>Ưu đãi</li>
      <li onClick={() => setSelectedTab("notifications")}>Thông báo</li>
      <li onClick={() => setSelectedTab("orderHistory")}>Lịch sử mua hàng</li>
      <li onClick={() => setSelectedTab("productReviews")}>Đánh giá sản phẩm</li>
      <li onClick={() => setSelectedTab("changePassword")}>Đổi mật khẩu</li>
      <li onClick={() => setSelectedTab("privacyPolicy")}>Chính sách & Quyền riêng tư</li>
      <li onClick={() => setSelectedTab("logout")}>Đăng xuất</li>
    </ul>
  );
};

export default Sidebar;
