// src/components/user/profile/Profile/ProfileInfo.js
import React from "react";
import Avatar from "../Avatar/Avatar";  // Hiển thị ảnh đại diện
import Sidebar from "../Sidebar/Sidebar";  // Sidebar bên trái
import EditProfile from "../EditProfile/EditProfile";  // Để chuyển tới trang chỉnh sửa
import "./ProfileInfo.css";  // Đảm bảo có file CSS cho Profile

const ProfileInfo = ({ user, setSelectedTab }) => {
  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <Sidebar setSelectedTab={setSelectedTab} />
      </div>

      <div className="profile-content">
        {/* Hiển thị thông tin người dùng */}
        <div className="profile-info">
          <h2>Profile Information</h2>
          <Avatar avatar={user.avatar} />  {/* Hiển thị ảnh đại diện */}
          <p><strong>Full Name:</strong> {user.fullName}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Phone:</strong> {user.phone}</p>
          <p><strong>Birthday:</strong> {user.birthday}</p>
          <p><strong>Gender:</strong> {user.gender}</p>
          <button
            onClick={() => setSelectedTab("update-profile")}
            className="update-profile-button"
          >
            Cập nhật thông tin
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileInfo;
