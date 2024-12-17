// src/components/user/profile/Avatar/Avatar.js
import React from "react";

const Avatar = ({ avatar }) => {
  return (
    <div className="avatar-container">
      <img src="https://i.pinimg.com/736x/d6/8e/c3/d68ec31c599a8bc27be4838de349864f.jpg" 
          alt="User Avatar" 
          className="avatar-img" />
      {/* Bạn có thể thêm các chức năng khác như thay đổi avatar ở đây */}
    </div>
  );
};

export default Avatar;
