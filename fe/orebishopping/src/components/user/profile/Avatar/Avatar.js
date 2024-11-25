// src/components/user/profile/Avatar/Avatar.js
import React from "react";

const Avatar = ({ avatar }) => {
  return (
    <div className="avatar-container">
      <img src={avatar} alt="User Avatar" className="avatar-img" />
      {/* Bạn có thể thêm các chức năng khác như thay đổi avatar ở đây */}
    </div>
  );
};

export default Avatar;
