import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import { newArrOne, newArrTwo, newArrThree, newArrFour } from "../../../assets/images/index"; // Import các hình ảnh

// Dữ liệu sản phẩm giảm giá từ 30% trở lên
import { newArrivalsData } from "../data/newArrivalsData"; 

// Import các nút điều hướng
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";

const SpecialOffers = () => {
  const [discountedProducts, setDiscountedProducts] = useState([]);

  useEffect(() => {
    // Lọc ra các sản phẩm có discount từ 30% trở lên
    const filteredProducts = newArrivalsData.filter((product) => {
      return product.discountPercentage >= 30;
    });
    setDiscountedProducts(filteredProducts);
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

  return (
    <div className="w-full pb-20">
      <Heading heading="Special Offers" />
      {/* Hiển thị sản phẩm giảm giá */}
      <Slider {...productSliderSettings}>
        {discountedProducts.map((product) => (
          <div key={product._id} className="relative px-2">
            <Product
              _id={product._id}
              img={product.img}
              productName={product.productName}
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
