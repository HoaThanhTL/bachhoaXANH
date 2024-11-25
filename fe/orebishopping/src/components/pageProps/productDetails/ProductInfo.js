import React from "react";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/levenstSlice";

const formatCurrency = (price) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductInfo = ({ productInfo }) => {
  const dispatch = useDispatch();
  const {
    productName = "Tên sản phẩm không khả dụng",
    originalPrice = 0,
    discountedPrice = 0,
    discountPercentage = 0,
    subcategory = "Không có",
    unit = "Không xác định",
    img = "",
    productDetails = {},
  } = productInfo || {};

  const {
    type = "Hàng tươi sống",
    description = "Sản phẩm tươi sống chất lượng cao.",
    manufactureDate = "2023-07-15",
    expiryDate = "2024-01-15",
  } = productDetails;

  return (
    <div className="flex flex-col gap-5 p-5 border rounded-md shadow-md bg-white">
      <h2 className="text-4xl font-semibold text-gray-800">{productName}</h2>

      <div className="text-xl font-medium text-gray-700">
        <span className="line-through text-gray-500 mr-3">
          {originalPrice > 0 ? formatCurrency(originalPrice) : "Liên hệ"}
        </span>
        <span className="text-red-600 font-bold">
          {discountedPrice > 0 ? formatCurrency(discountedPrice) : "Liên hệ"}
        </span>
        {discountPercentage > 0 && (
          <span className="ml-2 text-sm text-green-600">
            -{discountPercentage}%
          </span>
        )}
      </div>

      <p className="text-base text-gray-600">{description}</p>

      <div className="text-sm text-gray-600">
        <p>
          <span className="font-medium">Loại hàng:</span> {type}
        </p>
        <p>
          <span className="font-medium">Ngày sản xuất:</span> {manufactureDate}
        </p>
        <p>
          <span className="font-medium">Ngày hết hạn:</span> {expiryDate}
        </p>
        <p>
          <span className="font-medium">Danh mục phụ:</span> {subcategory}
        </p>
        <p>
          <span className="font-medium">Đơn vị:</span> {unit}
        </p>
      </div>

      {/* {img && <img src={img} alt={productName} className="rounded-md" />} */}

      <button
        onClick={() =>
          dispatch(
            addToCart({
              _id: productInfo?._id,
              name: productInfo?.productName,
              quantity: 1,
              image: img,
              price: discountedPrice,
            })
          )
        }
        className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont rounded-md"
      >
        Thêm vào giỏ hàng
      </button>
    </div>
  );
};

export default ProductInfo;
