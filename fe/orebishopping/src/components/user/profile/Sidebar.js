// src/components/user/profile/Sidebar/Sidebar.js
import React from "react";
import "./Sidebar.css"; // CSS cho Sidebar

const Sidebar = ({ setSelectedTab }) => {
  return (
    <div className="sidebar-container">
      <ul className="sidebar-list">
        <li onClick={() => setSelectedTab("profile")}>Profile</li>
        <li onClick={() => setSelectedTab("update-profile")}>Edit Profile</li>
        <li onClick={() => setSelectedTab("orderHistory")}>Order History</li>
        <li onClick={() => setSelectedTab("productReviews")}>Product Reviews</li>
        <li onClick={() => setSelectedTab("changePassword")}>Change Password</li>
        <li onClick={() => setSelectedTab("offers")}>Offers & Notifications</li>
        <li onClick={() => setSelectedTab("customerSupport")}>Customer Support</li>
        <li onClick={() => setSelectedTab("logout")}>Logout</li>
      </ul>
    </div>
  );
};

export default Sidebar;
