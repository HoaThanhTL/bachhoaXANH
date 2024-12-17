import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import Product from "../../home/Products/Product";
import axios from "axios";

const Pagination = ({ itemsPerPage }) => {
  const [products, setProducts] = useState([]); // Lưu trữ danh sách sản phẩm
  const [itemOffset, setItemOffset] = useState(0); // Dùng để theo dõi vị trí sản phẩm hiện tại
  const [loading, setLoading] = useState(true); // Trạng thái tải dữ liệu

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/api/products");
        setProducts(response.data); // Lưu dữ liệu sản phẩm từ API
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false); // Đặt trạng thái tải xong
      }
    };

    fetchProducts(); // Gọi API để lấy sản phẩm khi component mount
  }, []);

  const endOffset = itemOffset + itemsPerPage;
  const currentItems = products.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(products.length / itemsPerPage);

  const handlePageClick = (event) => {
    const newOffset = (event.selected * itemsPerPage) % products.length;
    setItemOffset(newOffset);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-10 mdl:gap-4 lg:gap-10">
        {currentItems.map((product) => (
          <div key={product.productId} className="w-full">
            <Product
              productId={product.productId}
              img={product.image}
              productName={product.name}
              originalPrice={product.originalPrice}
              discountedPrice={product.discountedPrice}
              discountPercentage={product.discountPercentage}
              unit={product.unit}
              description={product.description}
            />
          </div>
        ))}
      </div>

      <div className="flex flex-col mdl:flex-row justify-center mdl:justify-between items-center">
        <ReactPaginate
          nextLabel=""
          onPageChange={handlePageClick}
          pageRangeDisplayed={3}
          marginPagesDisplayed={2}
          pageCount={pageCount}
          previousLabel=""
          pageLinkClassName="w-9 h-9 border-[1px] border-lightColor hover:border-gray-500 duration-300 flex justify-center items-center"
          pageClassName="mr-6"
          containerClassName="flex text-base font-semibold font-titleFont py-10"
          activeClassName="bg-black text-white"
        />
        <p className="text-base font-normal text-lightText">
          Products from {itemOffset + 1} to {endOffset} of {products.length}
        </p>
      </div>
    </div>
  );
};

export default Pagination;
