// import React from "react";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../../redux/orebiSlice";

// const formatCurrency = (price) =>
//   price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

// const ProductInfo = ({ productInfo }) => {
//   const dispatch = useDispatch();
//   const {
//     productName = "Tên sản phẩm không khả dụng",
//     originalPrice = 0,
//     discountedPrice = 0,
//     discountPercentage = 0,
//     subcategory = "Không có",
//     unit = "Không xác định",
//     img = "",
//     productDetails = {},
//   } = productInfo || {};

//   const {
//     type = "Hàng tươi sống",
//     description = "Sản phẩm tươi sống chất lượng cao.",
//     manufactureDate = "2023-07-15",
//     expiryDate = "2024-01-15",
//   } = productDetails;

//   return (
//     <div className="flex flex-col gap-5 p-5 border rounded-md shadow-md bg-white">
//       <h2 className="text-4xl font-semibold text-gray-800">{productName}</h2>

//       <div className="text-xl font-medium text-gray-700">
//         <span className="line-through text-gray-500 mr-3">
//           {originalPrice > 0 ? formatCurrency(originalPrice) : "Liên hệ"}
//         </span>
//         <span className="text-red-600 font-bold">
//           {discountedPrice > 0 ? formatCurrency(discountedPrice) : "Liên hệ"}
//         </span>
//         {discountPercentage > 0 && (
//           <span className="ml-2 text-sm text-green-600">
//             -{discountPercentage}%
//           </span>
//         )}
//       </div>

//       <p className="text-base text-gray-600">{description}</p>

//       <div className="text-sm text-gray-600">
//         <p>
//           <span className="font-medium">Loại hàng:</span> {type}
//         </p>
//         <p>
//           <span className="font-medium">Ngày sản xuất:</span> {manufactureDate}
//         </p>
//         <p>
//           <span className="font-medium">Ngày hết hạn:</span> {expiryDate}
//         </p>
//         <p>
//           <span className="font-medium">Danh mục phụ:</span> {subcategory}
//         </p>
//         <p>
//           <span className="font-medium">Đơn vị:</span> {unit}
//         </p>
//       </div>

//       {/* {img && <img src={img} alt={productName} className="rounded-md" />} */}

//       <button
//         onClick={() =>
//           dispatch(
//             addToCart({
//               _id: productInfo?._id,
//               name: productInfo?.productName,
//               quantity: 1,
//               image: img,
//               price: discountedPrice,
//             })
//           )
//         }
//         className="w-full py-4 bg-primeColor hover:bg-black duration-300 text-white text-lg font-titleFont rounded-md"
//       >
//         Thêm vào giỏ hàng
//       </button>
//     </div>
//   );
// };

// export default ProductInfo;
import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import { addToCart } from "../../../redux/orebiSlice";
import axios from "axios";
import "./ProductInfo.css";

const formatCurrency = (price) =>
  price.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const ProductInfo = ({ productInfo }) => {
  const { _id } = useParams(); // Lấy productId từ URL
  const dispatch = useDispatch();
  const [quantity, setQuantity] = useState(1);  // Theo dõi số lượng
  const [isBuying, setIsBuying] = useState(false);  // Trạng thái "Mua"
  const [productInCart, setProductInCart] = useState(null);  // Trạng thái sản phẩm trong giỏ hàng
  const [productImages, setProductImages] = useState([]);  // Lưu trữ danh sách ảnh sản phẩm
  const [productDetail, setProductDetail] = useState(null); // Lưu trữ chi tiết sản phẩm

  useEffect(() => {
    // Gọi API lấy thông tin chi tiết sản phẩm từ backend
    const fetchProductDetail = async () => {
      try {
        const response = await axios.get(
          `http://127.0.0.1:8080/api/product-details/product/${_id}`
        );
        setProductDetail(response.data);  // Cập nhật thông tin chi tiết sản phẩm
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
    };

    fetchProductDetail(); // Gọi API khi component mount

    // Hàm kết hợp ảnh từ productInfo và productDetail.images
    const fetchProductImages = async () => {
      try {
        const images = [productInfo.image];  // Bắt đầu với ảnh của sản phẩm chính

        // Nếu có ảnh từ productDetail, thêm chúng vào danh sách
        if (productDetail && productDetail.images) {
          productDetail.images.forEach((image) => {
            images.push(image.imageUrl);  // Thêm ảnh chi tiết vào danh sách
          });
        }

        setProductImages(images);  // Cập nhật danh sách ảnh
      } catch (error) {
        console.error("Error fetching product images:", error);
      }
    };

    if (productDetail) {
      fetchProductImages(); // Gọi hàm fetch ảnh khi productDetail đã có
    }

  }, [productInfo, productDetail, _id]); // Chạy lại khi productInfo hoặc productDetail thay đổi

  const handleIncreaseQuantity = () => {
    setQuantity((prev) => Math.min(prev + 1, 100));  // Tăng số lượng, tối đa 100
  };

  const handleDecreaseQuantity = () => {
    setQuantity((prev) => Math.max(prev - 1, 1));  // Giảm số lượng, tối thiểu 1
  };

  const handleAddToCart = async (newQuantity) => {
    try {
      const accessToken = localStorage.getItem("authToken");

      // Gửi request đến backend để thêm sản phẩm vào giỏ hàng
      const response = await axios.post(
        `http://127.0.0.1:8080/api/cart/add?productId=${_id}&quantity=${newQuantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      console.log(response.data);

      dispatch(
        addToCart({
          _id: productInfo._id,
          name: productInfo.name,
          quantity: newQuantity,
          image: productInfo.image,
          price: productInfo.discountedPrice || productInfo.originalPrice,
        })
      );
      setProductInCart({ ...productInfo, quantity: newQuantity });  // Cập nhật giỏ hàng local
    } catch (error) {
      console.error("Error adding to cart:", error);
    }
  };

  const handleUpdateQuantity = async (newQuantity) => {
    try {
      const accessToken = localStorage.getItem("authToken");

      const response = await axios.put(
        `http://127.0.0.1:8080/api/cart/update?productId=${_id}&quantity=${newQuantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      setQuantity(newQuantity);
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const { name, originalPrice, discountedPrice, discountPercentage, unit, description } = productInfo;

  return (
    <div className="flex flex-col gap-5 p-5 border rounded-md shadow-md bg-white">
      <h2 className="text-4xl font-semibold text-gray-800">{name}</h2>

      <div className="text-xl font-medium text-gray-700">
        <span className="line-through text-gray-500 mr-3">
          {originalPrice > 0 ? formatCurrency(originalPrice) : "Liên hệ"}
        </span>
        <span className="text-red-600 font-bold">
          {discountedPrice > 0 ? formatCurrency(discountedPrice) : "Liên hệ"}
        </span>
        {discountPercentage > 0 && (
          <span className="ml-2 text-sm text-green-600">-{discountPercentage}%</span>
        )}
      </div>

      <p className="text-base text-gray-600">{description}</p>

      {/* Hiển thị danh sách ảnh sản phẩm */}
      <div className="product-images">
        {productImages.length > 0 ? (
          <div className="image-gallery">
            {productImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Product Image ${index + 1}`}
                className="w-full h-auto object-cover mb-4"
              />
            ))}
          </div>
        ) : (
          <p>Không có ảnh sản phẩm</p>
        )}
      </div>

      {/* Hiển thị chi tiết sản phẩm */}
      <div className="text-sm text-gray-600">
        <p><span className="font-medium">Đơn vị:</span> {unit}</p>
      </div>

      {/* Hiển thị thông tin chi tiết sản phẩm */}
      {productDetail && (
        <>
          <div className="text-sm text-gray-600">
            <p><span className="font-medium">Mô tả:</span> {productDetail.description}</p>
            <div>
              <span className="font-medium">Thông tin khác:</span>
              {productDetail.destable && productDetail.destable.headers && (
                <table className="w-full mt-2 border">
                  <thead>
                    <tr>
                      {productDetail.destable.headers.map((header, idx) => (
                        <th key={idx} className="border px-2 py-1">{header}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      {productDetail.destable.rows[0].map((row, idx) => (
                        <td key={idx} className="border px-2 py-1">{row}</td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </>
      )}

      {/* Chỉnh sửa số lượng */}
      {isBuying ? (
        <div className="quantity-container">
          <button onClick={() => handleUpdateQuantity(quantity - 1)} className="quantity-btn">-</button>
          <input
            type="number"
            value={quantity}
            onChange={(e) => handleUpdateQuantity(Math.min(Math.max(e.target.value, 1), 100))}
            className="quantity-input"
          />
          <button onClick={() => handleUpdateQuantity(quantity + 1)} className="quantity-btn">+</button>
        </div>
      ) : (
        <button
          onClick={() => {
            setIsBuying(true);
            handleAddToCart(quantity);
          }}
          className="buy-button"
        >
          MUA
        </button>
      )}
    </div>
  );
};

export default ProductInfo;
