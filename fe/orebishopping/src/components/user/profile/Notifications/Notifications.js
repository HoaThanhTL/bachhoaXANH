// src/components/user/profile/Notifications/Notifications.js
import React, { useState } from 'react';
import './Notifications.css'; // Import file CSS nếu cần

const Notifications = () => {
  // Dữ liệu giả cho thông báo
  const notifications = [
    {
      id: 1,
      title: 'Đơn hàng của bạn đã được vận chuyển',
      description: 'Đơn hàng #12345 của bạn đã được vận chuyển và đang trên đường đến bạn.',
      date: '2024-12-12 09:00 AM',
    },
    {
      id: 2,
      title: 'Khuyến mãi giảm giá 20%',
      description: 'Nhập mã "SALE20" khi thanh toán để được giảm giá 20% cho đơn hàng tiếp theo.',
      date: '2024-12-11 03:45 PM',
    },
    {
      id: 3,
      title: 'Cập nhật sản phẩm mới',
      description: 'Chúng tôi đã thêm nhiều sản phẩm mới. Hãy xem ngay những món đồ yêu thích của bạn.',
      date: '2024-12-10 05:30 PM',
    },
    {
      id: 4,
      title: 'Hết hàng sản phẩm yêu thích',
      description: 'Sản phẩm "Cửa sổ thông minh" hiện đã hết hàng. Đừng bỏ lỡ lần tiếp theo!',
      date: '2024-12-09 02:00 PM',
    },
    {
      id: 5,
      title: 'Cảm ơn bạn đã mua hàng!',
      description: 'Cảm ơn bạn đã mua sắm tại cửa hàng của chúng tôi. Hy vọng bạn sẽ hài lòng với sản phẩm.',
      date: '2024-12-08 11:20 AM',
    },
  ];

  return (
    <div className="notifications-container">
      <h2>Thông báo</h2>
      {notifications.length === 0 ? (
        <p>Hiện tại bạn không có thông báo mới.</p>
      ) : (
        <div className="notifications-list">
          {notifications.map((notification) => (
            <div key={notification.id} className="notification-card">
              <h3 className="notification-title">{notification.title}</h3>
              <p className="notification-description">{notification.description}</p>
              <span className="notification-date">{notification.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Notifications;
