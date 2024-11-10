import React from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import newArrivalsData from "../data/newArrivalsData";
import categoriesData from "../data/categoriesData";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  // Gộp tất cả sản phẩm vào đúng category lớn (không phân chia theo subcategory)
  const categories = categoriesData.reduce((acc, category) => {
    // Lặp qua từng sản phẩm và nhóm vào category lớn
    const filteredProducts = newArrivalsData.filter(product => {
      return category.subcategories.some(subcategory => subcategory.name === product.subcategory);
    });

    // Nếu có sản phẩm, thêm vào category lớn
    if (filteredProducts.length > 0) {
      acc[category.name] = filteredProducts;
    }

    return acc;
  }, {});

  // Cài đặt cho slider sản phẩm
  const productSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1025, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 769, settings: { slidesToShow: 2, slidesToScroll: 2 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  // Cài đặt cho slider banner (chỉ 1 banner hiển thị, tự động chuyển sau 5s)
  const bannerSliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
  };

  return (
    <div className="w-full pb-16">
      {/* Lặp qua các danh mục lớn */}
      {Object.keys(categories).map((category) => {
        const categoryData = categoriesData.find((cat) => cat.name === category);

        return (
          <div key={category} className="mb-8">
            {/* Hiển thị banner của danh mục với Slider */}
            {categoryData && categoryData.listImg.length > 0 && (
              <div className="mb-4">
                <Slider {...bannerSliderSettings}>
                  {categoryData.listImg.map((img, index) => (
                    <div key={index} className="px-2">
                      <img src={img} alt={category} className="w-full h-auto" />
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            {/* Hiển thị tiêu đề của danh mục */}
            <Heading heading={category} />

            {/* Hiển thị các sản phẩm trong danh mục */}
            <Slider {...productSliderSettings}>
              {categories[category].map((product) => (
                <div className="px-2" key={product._id}>
                  <Product
                    _id={product._id}
                    img={product.img}
                    productName={product.productName}
                    originalPrice={product.originalPrice}
                    discountedPrice={product.discountedPrice} 
                    discountPercentage={product.discountPercentage} 
                    color={product.color}
                    badge={product.badge}
                    des={product.des}
                  />
                </div>
              ))}
            </Slider>
          </div>
        );
      })}
    </div>
  );
};

export default NewArrivals;
