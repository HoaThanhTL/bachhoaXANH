import React, { useState } from "react";
import "./Sidebar.css";

const Sidebar = ({ setSelectedTab }) => {
  const [activeTab, setActiveTab] = useState("profile");

  const handleTabClick = (tab) => {
    setActiveTab(tab); // Cập nhật tab đang chọn
    setSelectedTab(tab); // Gọi callback để xử lý tab bên ngoài
  };

  return (
    <div className="sidebar-container">
      <ul className="sidebar-menu">
        <li
          className={activeTab === "profile" ? "active" : ""}
          onClick={() => handleTabClick("profile")}
        >
          Thông tin cá nhân
        </li>
        <li
          className={activeTab === "editProfile" ? "active" : ""}
          onClick={() => handleTabClick("editProfile")}
        >
          Chỉnh sửa thông tin
        </li>
        <li
          className={activeTab === "offers" ? "active" : ""}
          onClick={() => handleTabClick("offers")}
        >
          Ưu đãi
        </li>
        <li
          className={activeTab === "notifications" ? "active" : ""}
          onClick={() => handleTabClick("notifications")}
        >
          Thông báo
        </li>
        <li
          className={activeTab === "orderHistory" ? "active" : ""}
          onClick={() => handleTabClick("orderHistory")}
        >
          Lịch sử mua hàng
        </li>
        {/* <li
          className={activeTab === "productReviews" ? "active" : ""}
          onClick={() => handleTabClick("productReviews")}
        >
          Đánh giá sản phẩm
        </li> */}
        <li
          className={activeTab === "changePassword" ? "active" : ""}
          onClick={() => handleTabClick("changePassword")}
        >
          Đổi mật khẩu
        </li>
        <li
          className={activeTab === "privacyPolicy" ? "active" : ""}
          onClick={() => handleTabClick("privacyPolicy")}
        >
          Chính sách & Quyền riêng tư
        </li>
        <li
          className={activeTab === "logout" ? "active" : ""}
          onClick={() => handleTabClick("logout")}
        >
          Đăng xuất
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
