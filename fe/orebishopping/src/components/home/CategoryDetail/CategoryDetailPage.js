import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Slider from "react-slick"; 
import Product from "../Products/Product"; 
import newArrivalsData from "../data/newArrivalsData";
import categoriesData from "../data/categoriesData";
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";

const CategoryDetailPage = () => {
  const { categoryName } = useParams();
  const [productsBySubcategory, setProductsBySubcategory] = useState([]);
  const [showAll, setShowAll] = useState(false); // Trạng thái để điều khiển xem tất cả sản phẩm
  const [productsToShow, setProductsToShow] = useState(8); // Số lượng sản phẩm hiển thị ban đầu

  useEffect(() => {
    const category = categoriesData.find((cat) => cat.name === categoryName);

    if (category) {
      const products = newArrivalsData.filter((product) =>
        category.subcategories.some(
          (subcategory) => subcategory.name === product.subcategory
        )
      );

      // Nhóm sản phẩm theo subcategory
      const productsGroupedBySubcategory = category.subcategories.map((subcategory) => ({
        subcategory,
        products: products.filter((product) => product.subcategory === subcategory.name),
      }));

      setProductsBySubcategory(productsGroupedBySubcategory);
    }
  }, [categoryName]);

  // Hàm để thay đổi số lượng sản phẩm hiển thị khi nhấn "Xem thêm"
  const handleShowMore = () => {
    setShowAll(true);
    setProductsToShow(productsBySubcategory.flatMap(subcategoryGroup => subcategoryGroup.products).length);
  };

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
    <div className="w-full pb-16">
      <h1 className="text-2xl font-semibold text-center">{categoryName}</h1>

      {productsBySubcategory.length > 0 ? (
        productsBySubcategory.map((subcategoryGroup) => (
          <div key={subcategoryGroup.subcategory.name} className="mt-8">
            <h2 className="text-xl font-semibold">{subcategoryGroup.subcategory.name}</h2>

            {/* Hiển thị Slider cho các sản phẩm */}
            <Slider {...productSliderSettings}>
              {subcategoryGroup.products.slice(0, showAll ? undefined : productsToShow).map((product) => (
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

            {/* Thêm nút "Xem thêm" nếu có sản phẩm ẩn */}
            {subcategoryGroup.products.length > productsToShow && !showAll && (
              <button
                onClick={handleShowMore}
                className="mt-4 text-blue-500 hover:underline"
              >
                Xem thêm
              </button>
            )}
          </div>
        ))
      ) : (
        <p>Không có sản phẩm nào trong danh mục này.</p>
      )}
    </div>
  );
};

export default CategoryDetailPage;
