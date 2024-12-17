// src/components/user/profile/SomeParentComponent.js

import React, { useState } from "react";
//D:\TLCN_BachHoaXANH\bachhoaXANH\fe\orebishopping\src\components\logout\Logout.js
import Logout from "./../../../logout/Logout"; 
//D:\TLCN_BachHoaXANH\bachhoaXANH\fe\orebishopping\src\components\user\profile\Logout\SomeParentComponent.js

const SomeParentComponent = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Giả sử người dùng đã đăng nhập

  // Hàm xử lý khi người dùng đăng xuất
  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return (
    <div>
      {isLoggedIn ? (
        <Logout onLogout={handleLogout} />
      ) : (
        <p>Bạn đã đăng xuất!</p>
      )}
    </div>
  );
};

export default SomeParentComponent;
