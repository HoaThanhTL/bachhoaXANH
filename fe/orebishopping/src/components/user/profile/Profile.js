import React, { useState } from "react";
import Avatar from "./Avatar/Avatar";
import ChangePassword from "./ChangePassword/ChangePassword";
import ProfileInfo from "./Profile/ProfileInfo";
import EditProfile from "./EditProfile/EditProfile";
import Sidebar from "./Sidebar";
import OrderHistory from "../history/OrderHistory/OrderHistory";
import ProductReviews from "../history/ProductReviews/ProductReviews";
import PrivacyPolicy from "./PrivacyPolicy/PrivacyPolicy";
import Notifications from "./Notifications/Notifications";
import Offers from "./Offers/Offers";
import userData from "../../home/data/userData";
import "./Profile.css";

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const user = userData.user;
  const orderHistory = userData.orderHistory;
  const reviews = userData.reviews;

  const handleLogout = () => {
    // Xử lý logic đăng xuất tại đây
    console.log("Đăng xuất thành công");
  };

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <Sidebar setSelectedTab={setSelectedTab} />
      </div>

      <div className="profile-content">
        {selectedTab === "profile" && <ProfileInfo user={user} />}
        {selectedTab === "editProfile" && <EditProfile user={user} />}
        {selectedTab === "offers" && <Offers />}
        {selectedTab === "notifications" && <Notifications />}
        {selectedTab === "orderHistory" && <OrderHistory orderHistory={orderHistory} />}
        {/* {selectedTab === "productReviews" && <ProductReviews reviews={reviews} />} */}
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
