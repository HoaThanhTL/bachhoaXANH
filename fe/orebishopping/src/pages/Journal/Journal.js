import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";

const Journal = () => {
  const location = useLocation();
  const [prevLocation, setPrevLocation] = useState("");

  useEffect(() => {
    if (location?.state?.data) {
      setPrevLocation(location.state.data);
    }
  }, [location]);

  return (
    <div className="max-w-container mx-auto px-4">
      {/* Breadcrumb */}
      <Breadcrumbs title="Journals" prevLocation={prevLocation} />
      
      {/* Header Section */}
      <div className="py-10 text-center">
        <h1 className="text-2xl font-bold text-green-700 mb-4">
          Chính Sách Khách Hàng của <span className="text-yellow-500">OREBI</span>
        </h1>
        <p className="text-sm text-gray-600">
          - Áp dụng từ ngày 01/07/2024 -
        </p>
      </div>

      {/* Membership Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Member Section */}
        <div className="bg-green-50 p-6 rounded-lg border border-green-300">
          <h2 className="text-lg font-bold text-green-700 mb-2">Hạng Thành Viên</h2>
          <p className="text-sm mb-4">
            <strong>Điều kiện:</strong> Tích đủ điểm mua tại OREBBI.
          </p>
          <p className="text-sm">
            <strong>Ưu đãi:</strong> FREE SHIP cho đơn từ 100.000đ, tích thêm nhiều ưu đãi.
          </p>
        </div>

        {/* VIP Section */}
        <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-300">
          <h2 className="text-lg font-bold text-yellow-600 mb-2">Hạng V.I.P</h2>
          <p className="text-sm mb-4">
            <strong>Điều kiện:</strong> Tích lũy mua hàng từ 6 triệu/năm.
          </p>
          <p className="text-sm">
            <strong>Ưu đãi:</strong> FREE SHIP cho đơn từ 100.000đ, hưởng thêm quyền lợi lớn.
          </p>
        </div>
      </div>

      {/* Notice Section */}
      <div className="bg-gray-50 p-6 rounded-lg border border-gray-300 mb-10">
        <h3 className="text-md font-bold text-gray-700 mb-2">(*) Lưu ý:</h3>
        <ul className="text-sm text-gray-600 list-disc ml-6">
          <li>Điểm được tích lũy từ các sản phẩm trong đơn hàng.</li>
          <li>Không áp dụng chính sách giảm giá với giao ngay.</li>
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="bg-blue-50 p-6 rounded-lg border border-blue-300">
        <h3 className="text-lg font-bold text-blue-700 mb-4">Bạn hỏi Bách Hóa Xanh trả lời:</h3>
        <div className="space-y-4">
          <div className="p-4 bg-white shadow-md rounded-lg">
            <p className="text-sm font-semibold">Tôi mua hàng 5 triệu, có đủ lên hạng VIP?</p>
            <p className="text-sm text-gray-600">
              Không, bạn cần đạt tối thiểu 6 triệu để đạt hạng VIP.
            </p>
          </div>
        </div>
      </div>

      {/* Continue Shopping Button */}
      <div className="text-center mt-8">
        <Link to="/shop">
          <button className="px-6 py-3 bg-green-700 text-white font-semibold rounded-md hover:bg-green-800 transition">
            Tiếp Tục Mua Sắm
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Journal;
