// src/components/user/profile/Profile.js
import React, { useState } from "react";
import Avatar from "./Avatar/Avatar"; // Đúng đường dẫn đến Avatar
import ChangePassword from "./ChangePassword/ChangePassword";
import EditProfile from "./EditProfile/EditProfile";
import Sidebar from "./Sidebar";
import OrderHistory from "../history/OrderHistory/OrderHistory";
import ProductReviews from "../history/ProductReviews/ProductReviews";
import userData from "../../home/data/userData"; // Import dữ liệu từ userData.js
import "./Profile.css";

const Profile = () => {
  // Lưu trữ dữ liệu nhưng không thay đổi nó, chỉ cần sử dụng giá trị cố định từ userData
  const [selectedTab, setSelectedTab] = useState("profile");
  const user = userData.user;  // Sử dụng trực tiếp dữ liệu từ userData
  const orderHistory = userData.orderHistory;  // Sử dụng lịch sử đơn hàng từ userData
  const reviews = userData.reviews;  // Sử dụng đánh giá từ userData

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <Sidebar setSelectedTab={setSelectedTab} />
      </div>

      <div className="profile-content">
        {/* Hiển thị theo tab đã chọn */}
        {selectedTab === "profile" && (
          <>
            <Avatar avatar={user.avatar} /> {/* Truyền avatar từ userData */}
            <EditProfile user={user} />  {/* Truyền thông tin người dùng vào EditProfile */}
          </>
        )}
        {selectedTab === "orderHistory" && <OrderHistory orderHistory={orderHistory} />}  {/* Truyền lịch sử đơn hàng */}
        {selectedTab === "productReviews" && <ProductReviews reviews={reviews} />}  {/* Truyền đánh giá sản phẩm */}
        {selectedTab === "changePassword" && <ChangePassword />}  {/* Cung cấp tính năng thay đổi mật khẩu */}
      </div>
    </div>
  );
};

export default Profile;
