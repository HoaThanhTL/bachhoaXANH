// src/components/user/profile/ChangePassword/ChangePassword.js
import React from 'react';

const ChangePassword = () => {
  const handleChangePassword = () => {
    alert('Password change feature is not implemented yet');
  };

  return (
    <div className="change-password">
      <h2>Change Password</h2>
      <button onClick={handleChangePassword}>Change Password</button>
    </div>
  );
};

export default ChangePassword;
