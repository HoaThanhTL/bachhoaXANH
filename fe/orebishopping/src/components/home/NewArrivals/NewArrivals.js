import React, { useEffect, useState, useRef } from "react";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import newArrivalsData from "../data/newArrivalsData";
import categoriesData from "../data/categoriesData";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

const NewArrivals = () => {
  const [categories, setCategories] = useState({});
  const sliderRefs = useRef([]);

  useEffect(() => {
    console.log("categoriesData", categoriesData); // Kiểm tra dữ liệu categoriesData
    console.log("newArrivalsData", newArrivalsData); // Kiểm tra dữ liệu newArrivalsData

    // Cập nhật categories từ newArrivalsData theo từng subcategory trong categoriesData
    const updatedCategories = categoriesData.reduce((acc, category) => {
      const filteredProducts = newArrivalsData.filter((product) =>
        category.subcategories.some(
          (subcategory) => subcategory.name === product.subcategory
        )
      );
      
      console.log("Filtered products for category", category.name, filteredProducts); // Debug sản phẩm theo từng category

      if (filteredProducts.length > 0) {
        acc[category.name] = filteredProducts;
      }

      return acc;
    }, {});

    setCategories(updatedCategories);
  }, []);

  useEffect(() => {
    console.log("Categories after update:", categories); // Kiểm tra categories sau khi được cập nhật
    sliderRefs.current.forEach((slider) => {
      if (slider) {
        slider.slickGoTo(0); // Đặt lại vị trí slider sau khi categories thay đổi
      }
    });
  }, [categories]);

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

  const bannerSliderSettings = {
    ...commonSliderSettings,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  return (
    <div className="w-full pb-16">
      {Object.keys(categories).map((category, index) => {
        const categoryData = categoriesData.find((cat) => cat.name === category);
        console.log("Rendering category:", category); // Debug tên category đang được render

        return (
          <div key={category} className="mb-8">
            {categoryData && categoryData.listImg.length > 0 && (
              <div className="mb-4">
                <Slider
                  {...bannerSliderSettings}
                  key={`banner-${index}`}
                  ref={(el) => (sliderRefs.current[index] = el)}
                >
                  {categoryData.listImg.map((img, imgIndex) => (
                    <div key={imgIndex} className="px-2">
                      <img src={img} alt={category} className="w-full h-auto" />
                    </div>
                  ))}
                </Slider>
              </div>
            )}

            <Heading heading={category} />

            {/* Debug thông tin sản phẩm trong category */}
            <Slider
              {...productSliderSettings}
              key={`product-slider-${category}`}
              ref={(el) => (sliderRefs.current[index + categoriesData.length] = el)}
            >
              {categories[category].map((product) => (
                <div key={product._id} className="px-2">
                  <Product
                    _id={product._id}
                    img={product.img}
                    productName={product.productName}
                    originalPrice={product.originalPrice}
                    discountedPrice={product.discountedPrice}
                    discountPercentage={product.discountPercentage}
                    badge={product.discountPercentage > 0 ? "Sale" : null}
                    unit={product.unit}
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
