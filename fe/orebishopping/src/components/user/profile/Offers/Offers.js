import React, { useState } from "react";
import "./Offers.css"; // Import file CSS để tạo kiểu đẹp mắt

const Offers = () => {
  // Dữ liệu ưu đãi
  const offers = [
    {
      id: 1,
      title: "Giảm giá 20% cho đơn hàng đầu tiên",
      description: "Nhập mã giảm giá FIRST20 khi thanh toán để nhận ưu đãi.",
      image: "https://cdn.tgdd.vn/Files/2022/06/15/1440001/tu-15-06-20-6-2022-khuyen-mai-tuan-le-bach-hoa-xanh-giam-den-30-202206151507523379.jpg",
    },
    {
      id: 2,
      title: "Giảm giá 50K cho đơn hàng từ 500K",
      description: "Áp dụng mã giảm giá DEAL50K khi thanh toán.",
      image: "https://cdn.tgdd.vn/Files/2022/05/12/1431922/tu-ngay-15-5-20-5-2022-khuyen-mai-tuan-le-bach-hoa-xanh-giam-den-40-202205121038495981.jpg",
    },
    {
      id: 3,
      title: "Miễn phí vận chuyển",
      description: "Miễn phí vận chuyển cho đơn hàng trên 200K trong khu vực TP.HCM.",
      image: "https://cdn.tgdd.vn/Files/2022/03/14/1420201/tu-ngay-15-3-20-3-2022-giam-gia-den-50-khi-mua-hang-online-tai-bach-hoa-xanh-202203141116562044.jpg",
    },
  ];

  // State để quản lý tìm kiếm
  const [searchTerm, setSearchTerm] = useState("");

  // Filter các ưu đãi theo tìm kiếm
  const filteredOffers = offers.filter((offer) =>
    offer.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="offers-container">
      <h2>Ưu đãi của bạn</h2>

      {/* Lời cảm ơn */}
      <p className="thank-you-message">Cảm ơn bạn đã ghé thăm! Hãy khám phá các ưu đãi hấp dẫn dưới đây.</p>

      {/* Thanh tìm kiếm */}
      <div className="search-bar">
        <input
          type="text"
          placeholder="Tìm kiếm ưu đãi..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
      </div>

      {filteredOffers.length === 0 ? (
        <p>Không tìm thấy ưu đãi nào phù hợp với từ khóa của bạn.</p>
      ) : (
        <div className="offers-list">
          {filteredOffers.map((offer) => (
            <div key={offer.id} className="offer-card">
              <img src={offer.image} alt={offer.title} className="offer-image" />
              <div className="offer-details">
                <h3 className="offer-title">{offer.title}</h3>
                <p className="offer-description">{offer.description}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Offers;
