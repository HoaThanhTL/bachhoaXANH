import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import axios from "axios"; // Import axios để gọi API

// Import các nút điều hướng
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";

const SpecialOffers = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]); // Lưu trữ sản phẩm giảm giá
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu
  const [error, setError] = useState(null); // Trạng thái lỗi nếu có

  useEffect(() => {
    const fetchDiscountedProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/api/products"); // Gọi API lấy sản phẩm
        const filteredProducts = response.data.filter(
          (product) => product.discountPercentage >= 10 // Lọc sản phẩm có giảm giá >= 10%
        );
        setDiscountedProducts(filteredProducts); // Lưu trữ sản phẩm đã lọc
      } catch (error) {
        console.error("Error fetching products:", error);
        setError("Có lỗi khi tải dữ liệu");
      } finally {
        setLoading(false); // Kết thúc việc tải dữ liệu
      }
    };

    fetchDiscountedProducts(); // Gọi hàm khi component mount
  }, []);

  // Cài đặt cấu hình slider
  const commonSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1025, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 769, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  const productSliderSettings = {
    ...commonSliderSettings,
    slidesToShow: 4,
  };

  // Hiển thị loading nếu chưa tải xong dữ liệu
  if (loading) {
    return <div>Loading...</div>;
  }

  // Hiển thị thông báo lỗi nếu có lỗi
  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className="w-full pb-20">
      <Heading heading="KHUYẾN MÃI SỐC" />
      {/* Hiển thị sản phẩm giảm giá */}
      <Slider {...productSliderSettings}>
        {discountedProducts.map((product) => (
          <div key={product.productId} className="relative px-2">
            <Product
              _id={product.productId}
              img={product.image}
              productName={product.name}
              originalPrice={product.originalPrice}
              discountedPrice={product.discountedPrice}
              discountPercentage={product.discountPercentage}
              badge={"Sale Cực Sốc"} // Thêm nhãn "Sale Cực Sốc"
              unit={product.unit}
            />
            {/* Nhãn Sale Cực Sốc */}
            <div className="absolute top-0 left-0 bg-red-500 text-white py-1 px-2 font-semibold">
              Sale Cực Sốc
            </div>
          </div>
        ))}
      </Slider>

      {/* Thêm nút "Xem thêm" để người dùng chuyển đến trang sản phẩm */}
      <Link
        to="/special-offers"
        className="mt-4 text-blue-500 hover:underline"
      >
        Xem thêm
      </Link>
    </div>
  );
};

export default SpecialOffers;
