import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Slider from "react-slick";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import SampleNextArrow from "./SampleNextArrow";
import SamplePrevArrow from "./SamplePrevArrow";

// Common slider settings should be defined here
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

const NewArrivals = () => {
  const [categories, setCategories] = useState([]);
  

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/categories");
        console.log("Response status:", response.status); // Log mã trạng thái
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        console.log("Fetched categories:", data); // Log dữ liệu trả về
        setCategories(data);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };    

    fetchCategories();
  }, []);

  const productSliderSettings = {
    ...commonSliderSettings,
    slidesToShow: 4,
  };
console.log("kiem tra");
console.log("kiem tra");
  return (
    <div className="w-full pb-16">
      {categories.map((category) => (
        <CategoryProducts
          key={category.categoryId}
          category={category}
          productSliderSettings={productSliderSettings}
        />
      ))}
    </div>
  );
};

const CategoryProducts = ({ category, productSliderSettings }) => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProductsByCategory = async () => {
      try {
        // Gọi API lấy danh sách sản phẩm theo categoryId
        const response = await fetch(
          `http://127.0.0.1:8080/api/products/category/${category.categoryId}`
        );
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(
          `Failed to fetch products for category ${category.name}:`,
          error
        );
      }
    };

    fetchProductsByCategory();
  }, [category.categoryId, category.name]);

  const bannerSliderSettings = {
    ...commonSliderSettings,
    slidesToShow: 1,
    autoplay: true,
    autoplaySpeed: 5000,
  };

  const bannerImages = [
    category.image && !category.image.startsWith('http') 
        ? `http://127.0.0.1:8080/images/${category.image}` 
        : category.image, 
    `https://cdnv2.tgdd.vn/bhx-static/bhx/5599/trang-cate-pc-sua-lai_202409161507540697.jpg`, 
    `https://cdnv2.tgdd.vn/bhx-static/bhx/5599/pc_202411131032408748.png`,
];

  return (
    <div className="mb-8">
      
      {/* Slider Banner */}
      <div className="mb-4">
        <Slider {...bannerSliderSettings}>
          {bannerImages.map((img, index) => (
            <div key={index} className="px-2">
              <img src={img} alt={category.name} className="w-full h-auto" />
            </div>
          ))}
        </Slider>
      </div>
      <Heading heading={category.name} />
      {/* Các sản phẩm trong category */}
      <Slider {...productSliderSettings}>
        {products.map((product) => (
          <div key={product.productId} className="px-2">
            <Product
              _id={product.productId}
              img={product.image}
              productName={product.name}
              originalPrice={product.originalPrice}
              discountedPrice={product.discountedPrice}
              discountPercentage={product.discountPercentage}
              unit={product.unit}
            />
          </div>
        ))}
      </Slider>

      <Link
        to={`/category/${category.categoryId}`}
        className="mt-4 text-blue-500 hover:underline"
      >
        Xem thêm
      </Link>
    </div>
  );
};

export default NewArrivals;
