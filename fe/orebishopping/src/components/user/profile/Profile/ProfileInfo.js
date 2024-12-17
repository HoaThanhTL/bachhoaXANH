import React from "react";
import "./ProfileInfo.css";

const ProfileInfo = ({ user, setSelectedTab }) => {
  return (
    <div className="profileinfo-container">
      {/* Phần ảnh bìa và ảnh đại diện */}
      <div className="cover-avatar-container">
        <img
          src="https://i.pinimg.com/1200x/7e/c9/d3/7ec9d3129f7a735f1775f7ed850aae0d.jpg"
          alt="Cover"
          className="cover-bia-img"
        />
        <div className="avatar-container">
          <img
            src="https://i.pinimg.com/736x/d6/8e/c3/d68ec31c599a8bc27be4838de349864f.jpg"
            alt="Avatar"
            className="cover-avt-img"
          />
        </div>
      </div>

      {/* Thông tin người dùng */}
      <div className="profile-info-user">
        <h2>Thông tin cá nhân</h2>
        <p><strong>Họ và tên:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Số điện thoại:</strong> {user.phone}</p>
        <p><strong>Địa chỉ:</strong> {user.address} </p>
        <button
          onClick={() => setSelectedTab("editProfile")}
          className="update-profile-button"
        >
          Chỉnh sửa thông tin
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
