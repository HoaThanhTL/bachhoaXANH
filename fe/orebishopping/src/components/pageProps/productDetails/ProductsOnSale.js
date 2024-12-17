import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";  // Dùng Link để điều hướng đến trang khác

const ProductsOnSale = () => {
  const [products, setProducts] = useState([]);  // Lưu trữ danh sách sản phẩm
  const [loading, setLoading] = useState(true);  // Trạng thái tải dữ liệu

  // Hàm gọi API lấy sản phẩm
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/api/products");
        // Lọc các sản phẩm có discountPercentage >= 30
        const filteredProducts = response.data.filter(
          (product) => product.discountPercentage >= 10
        );
        setProducts(filteredProducts);  // Cập nhật sản phẩm sau khi lọc
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);  // Kết thúc tải dữ liệu
      }
    };

    fetchProducts();  // Gọi API khi component mount
  }, []);

  // Hiển thị loading khi dữ liệu chưa được tải xong
  if (loading) {
    return <div>Loading...</div>;
  }

  // Chỉ lấy 4 sản phẩm đầu tiên
  const displayedProducts = products.slice(0, 4);

  return (
    <div>
      <h3 className="font-titleFont text-xl font-semibold mb-6 underline underline-offset-4 decoration-[1px]">
        Products on Sale
      </h3>
      <div className="flex flex-col gap-2">
        {displayedProducts.length > 0 ? (
          displayedProducts.map((item) => (
            <div
              key={item.productId}
              className="flex items-center gap-4 border-b-[1px] border-b-gray-300 py-2"
            >
              <div>
                <img className="w-24" src={item.image} alt={item.name} />
              </div>
              <div className="flex flex-col gap-2 font-titleFont">
                <p className="text-base font-medium">{item.name}</p>
                <p className="text-sm font-semibold">
                  {item.discountedPrice > 0
                    ? `$${item.discountedPrice}`
                    : "Liên hệ"}
                </p>
                {item.discountPercentage > 0 && (
                  <span className="text-green-600">-{item.discountPercentage}%</span>
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No products on sale with 10% discount or more.</p>
        )}
      </div>
      {/* Nút "Xem thêm" chuyển đến trang chi tiết */}
      <div className="mt-4">
        <Link to="/offer" className="text-blue-600 hover:underline">
          Xem thêm
        </Link>
      </div>
    </div>
  );
};

export default ProductsOnSale;
