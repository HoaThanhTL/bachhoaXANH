import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import ChangePassword from "./ChangePassword/ChangePassword";
import ProfileInfo from "./Profile/ProfileInfo";
import EditProfile from "./EditProfile/EditProfile";
import Sidebar from "./Sidebar";
import OrderHistory from "../history/OrderHistory/OrderHistory";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import Notifications from "./Notifications/Notifications";
import Offers from "./Offers/Offers";
import "./Profile.css";

const Profile = () => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("profile");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
  
        const accessToken = localStorage.getItem("authToken");
        const userId = localStorage.getItem("userId");

        if (!accessToken || !userId) {
          throw new Error("Không tìm thấy token hoặc userId. Vui lòng đăng nhập lại.");
        }
  
        const response = await fetch(`http://127.0.0.1:8080/api/users/current`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        });
  
        if (!response.ok) {
          throw new Error("Lỗi khi gọi API: " + response.statusText);
        }
  
        const data = await response.json();
        setUser(data); // Cập nhật thông tin người dùng
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
  
    fetchUserData();
  }, [navigate]);
  
  const updateUserProfile = (updatedUser) => {
    setUser(updatedUser); // Cập nhật user state với thông tin mới
  };
  
  const handleLogout = () => {
    localStorage.removeItem("authToken"); // Xóa token khi đăng xuất
    navigate("/signin"); // Điều hướng về trang đăng nhập
  };

  if (loading) return <div>Đang tải...</div>;
  if (error) return <div>Lỗi: {error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <Sidebar setSelectedTab={setSelectedTab} />
      </div>

      <div className="profile-content">
        {selectedTab === "profile" && user && <ProfileInfo user={user} />}
        {selectedTab === "editProfile" && user && <EditProfile user={user} updateUserProfile={updateUserProfile} />}
        {selectedTab === "offers" && <Offers />}
        {selectedTab === "notifications" && <Notifications />}
        {selectedTab === "orderHistory" && <OrderHistory orderHistory={[]} />}
        {selectedTab === "changePassword" && <ChangePassword />}
        {selectedTab === "privacyPolicy" && <PrivacyPolicy />}
        {selectedTab === "logout" && (
          <div className="logout-container">
            <h3>Bạn có chắc chắn muốn đăng xuất?</h3>
            <button onClick={handleLogout}>Đăng xuất</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
