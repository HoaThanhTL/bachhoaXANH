import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Product from "../Products/Product";
import Slider from "react-slick";
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";

const SubcategoryDetailPage = () => {
  const { subCategoryId } = useParams();
  const [products, setProducts] = useState([]);
  const [subcategoryName, setSubcategoryName] = useState("");

  useEffect(() => {
    const fetchProductsBySubcategory = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/products/subcategory/${subCategoryId}`);
        const data = await response.json();
        setProducts(data); 
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    const fetchSubcategoryName = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/subcategories/${subCategoryId}`);
        const data = await response.json();
        setSubcategoryName(data.name); 
      } catch (error) {
        console.error("Error fetching subcategory:", error);
      }
    };

    fetchProductsBySubcategory();
    fetchSubcategoryName();
  }, [subCategoryId]);

  const sliderSettings = {
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />,
    responsive: [
      { breakpoint: 1025, settings: { slidesToShow: 3, slidesToScroll: 1 } },
      { breakpoint: 769, settings: { slidesToShow: 2, slidesToScroll: 1 } },
      { breakpoint: 480, settings: { slidesToShow: 1, slidesToScroll: 1 } },
    ],
  };

  return (
    <div className="w-full pb-16">
      <h1 className="text-2xl font-semibold text-center">
        Gian hàng {subcategoryName || "Đang tải..."}
      </h1>
      {products.length > 0 ? (
        <Slider {...sliderSettings}>
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
      ) : (
        <p>Không có sản phẩm nào trong danh mục con này.</p>
      )}
    </div>
  );
};

export default SubcategoryDetailPage;
