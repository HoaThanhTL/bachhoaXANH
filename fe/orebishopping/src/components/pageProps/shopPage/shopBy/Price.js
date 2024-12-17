import React, { useState, useEffect } from "react";
import NavTitle from "./NavTitle";
import axios from "axios"; // Thêm axios để gọi API

const Price = () => {
  const [priceRanges, setPriceRanges] = useState([]); // Lưu giá trị phạm vi giá
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  useEffect(() => {
    // Gọi API để lấy tất cả sản phẩm
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/api/products");
        const products = response.data;

        // Lọc các sản phẩm theo giá discount
        const ranges = [
          { priceFrom: 0, priceTo: 50000 },
          { priceFrom: 50000, priceTo: 100000 },
          { priceFrom: 100000, priceTo: 200000 },
          { priceFrom: 200000, priceTo: 400000 },
          { priceFrom: 400000, priceTo: 600000 },
          { priceFrom: 600000, priceTo: 1000000 },
        ];

        const filteredRanges = ranges.map((range) => {
          // Lọc các sản phẩm trong mỗi phạm vi giá
          const productsInRange = products.filter(
            (product) =>
              product.discountedPrice >= range.priceFrom &&
              product.discountedPrice <= range.priceTo
          );

          return {
            ...range,
            products: productsInRange,
          };
        });

        setPriceRanges(filteredRanges); // Lưu các phạm vi giá với sản phẩm
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Xong tải dữ liệu
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="cursor-pointer">
      <NavTitle title="Mua theo giá" icons={false} />
      <div className="font-titleFont">
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {priceRanges.map((range, index) => (
            <li
              key={index}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2 flex items-center gap-2 hover:text-primeColor hover:border-gray-400 duration-300"
            >
              {range.products.length > 0 ? (
                <>
                  <span>
                    {range.priceFrom.toLocaleString()}₫ -{" "}
                    {range.priceTo.toLocaleString()}₫
                  </span>
                  <span className="text-gray-500">
                    ({range.products.length} sản phẩm)
                  </span>
                </>
              ) : (
                <span>
                  {range.priceFrom.toLocaleString()}₫ -{" "}
                  {range.priceTo.toLocaleString()}₫
                </span>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Price;
