// src/components/user/profile/Logout/Logout.js

import React from "react";

const Logout = ({ onLogout }) => {
  return (
    <div className="logout-container">
      <button className="logout-button" onClick={onLogout}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
