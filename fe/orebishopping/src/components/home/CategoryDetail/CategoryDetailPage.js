import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Slider from "react-slick"; 
import Product from "../Products/Product"; 
import SampleNextArrow from "../NewArrivals/SampleNextArrow";
import SamplePrevArrow from "../NewArrivals/SamplePrevArrow";

const CategoryDetailPage = () => {
  const { categoryId } = useParams(); // Lấy categoryId từ URL
  const [categoryName, setCategoryName] = useState(""); // Lưu tên danh mục
  const [productsBySubcategory, setProductsBySubcategory] = useState([]);
  const [showAll, setShowAll] = useState(false);
  const [productsToShow, setProductsToShow] = useState(8);
  const [subcategories, setSubcategories] = useState([]);

  useEffect(() => {
    // Gửi yêu cầu lấy thông tin danh mục từ API
    const fetchCategoryName = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/categories/${categoryId}`);
        const data = await response.json();
        setCategoryName(data.name); // Cập nhật tên danh mục từ dữ liệu API
      } catch (error) {
        console.error("Error fetching category:", error);
      }
    };

    fetchCategoryName();
  }, [categoryId]);

  useEffect(() => {
    const fetchSubcategories = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:8080/api/subcategories`);
        const data = await response.json();
        const filteredSubcategories = data.filter(subcategory => subcategory.categoryId === parseInt(categoryId));
        setSubcategories(filteredSubcategories);
      } catch (error) {
        console.error("Error fetching subcategories:", error);
      }
    };

    fetchSubcategories();
  }, [categoryId]);

  useEffect(() => {
    // Lấy sản phẩm từ API cho mỗi subcategoryId
    const fetchProducts = async () => {
      try {
        const productsPromises = subcategories.map(async (subcategory) => {
          const response = await fetch(`http://127.0.0.1:8080/api/products/subcategory/${subcategory.subCategoryId}`);
          const data = await response.json();
          return {
            subcategory,
            products: data,
          };
        });

        const productsData = await Promise.all(productsPromises);
        setProductsBySubcategory(productsData);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (subcategories.length > 0) {
      fetchProducts();
    }
  }, [subcategories]);

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
      {/* Hiển thị tên danh mục từ API */}
      <h1 className="text-2xl font-semibold text-center">
        Danh mục: {categoryName || "Đang tải..."}
      </h1>

      {productsBySubcategory.length > 0 ? (
        productsBySubcategory.map((subcategoryGroup) => (
          <div key={subcategoryGroup.subcategory.subCategoryId} className="mt-8">
            <h2 className="text-xl font-semibold">{subcategoryGroup.subcategory.name}</h2>

            <Slider {...productSliderSettings}>
              {subcategoryGroup.products.slice(0, showAll ? undefined : productsToShow).map((product) => (
                <div key={product._id} className="px-2">
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

            {subcategoryGroup.products.length > productsToShow && !showAll && (
              <Link
                to={`/category/${categoryId}`}
                className="mt-4 text-blue-500 hover:underline"
                onClick={handleShowMore}
              >
                Xem thêm
              </Link>
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
