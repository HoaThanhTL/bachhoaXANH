import React from "react";
import { useParams } from "react-router-dom";
import Heading from "../Products/Heading";
import Product from "../Products/Product";
import newArrivalsData from "../data/newArrivalsData";
import categoriesData from "../data/categoriesData";

const CategoryDetailPage = () => {
  const { categoryName } = useParams(); // Lấy category từ URL

  // Tìm category dữ liệu dựa trên categoryName
  const categoryData = categoriesData.find((category) => category.name === categoryName);

  if (!categoryData) {
    return <div>Category not found</div>;
  }

  return (
    <div className="w-full pb-20">
      <Heading heading={`Chi tiết sản phẩm: ${categoryName}`} />

      {/* Hiển thị sản phẩm theo subcategories */}
      {categoryData.subcategories.map((subcategory) => (
        <div key={subcategory.name} className="mb-10">
          <Heading heading={subcategory.name} />

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {newArrivalsData
              .filter((product) => product.subcategory === subcategory.name)
              .map((item) => {
                const discountedPrice =
                  item.discountPercentage > 0
                    ? (item.originalPrice * (1 - item.discountPercentage / 100)).toFixed(2)
                    : item.originalPrice.toFixed(2);

                const isOnSale = item.sale;

                return (
                  <Product
                    key={item._id}
                    img={item.img}
                    productName={item.productName}
                    originalPrice={isOnSale ? item.originalPrice.toFixed(2) : null}
                    discountPercentage={isOnSale ? item.discountPercentage : null}
                    discountedPrice={isOnSale ? discountedPrice : null}
                    color={item.color}
                    badge={item.badge}
                    sale={isOnSale}
                    des={item.des}
                  />
                );
              })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CategoryDetailPage;
