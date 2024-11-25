import React, { useState } from "react";
import Avatar from "./Avatar/Avatar"; 
import ChangePassword from "./ChangePassword/ChangePassword";
import EditProfile from "./EditProfile/EditProfile";
import Sidebar from "./Sidebar";
import OrderHistory from "../history/OrderHistory/OrderHistory";
import ProductReviews from "../history/ProductReviews/ProductReviews";
import userData from "../../home/data/userData"; 
import "./Profile.css";

const Profile = () => {
  const [selectedTab, setSelectedTab] = useState("profile");
  const user = userData.user; 
  const orderHistory = userData.orderHistory; 
  const reviews = userData.reviews;  

  return (
    <div className="profile-container">
      <div className="profile-sidebar">
        <Sidebar setSelectedTab={setSelectedTab} />
      </div>

      <div className="profile-content">
        {selectedTab === "profile" && (
          <>
            <Avatar avatar={user.avatar} /> 
            <EditProfile user={user} />
          </>
        )}
        {selectedTab === "orderHistory" && <OrderHistory orderHistory={orderHistory} />} 
        {selectedTab === "productReviews" && <ProductReviews reviews={reviews} />} 
        {selectedTab === "changePassword" && <ChangePassword />} 
      </div>
    </div>
  );
};

export default Profile;
