import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false); // Trạng thái hiển thị khối "Mua"

  const handleProductDetails = () => {
    navigate(`/product/${props._id}`, {
      state: {
        item: props,
      },
    });
  };

  const handleAddToCart = (newQuantity) => {
    dispatch(
      addToCart({
        _id: props._id,
        name: props.productName,
        quantity: newQuantity,
        image: props.img,
        price: props.discountedPrice || props.originalPrice,
      })
    );
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = quantity + 1 > 100 ? 100 : quantity + 1; // Không vượt quá 100
    setQuantity(newQuantity);
    handleAddToCart(newQuantity); // Cập nhật giỏ hàng
  };

  const handleDecreaseQuantity = () => {
    const newQuantity = quantity - 1 < 1 ? 1 : quantity - 1; // Không nhỏ hơn 1
    setQuantity(newQuantity);
    handleAddToCart(newQuantity); // Cập nhật giỏ hàng
  };

  const handleQuantityChange = (e) => {
    let newQuantity = parseInt(e.target.value, 10) || 1; // Chuyển về 1 nếu nhập không hợp lệ
    if (newQuantity > 100) newQuantity = 100; // Không vượt quá 100
    if (newQuantity < 1) newQuantity = 1; // Không nhỏ hơn 1
    setQuantity(newQuantity);
    handleAddToCart(newQuantity); // Cập nhật giỏ hàng
  };

  return (
    <div className="product-card border p-4 rounded-lg bg-white flex flex-col justify-between">
      {/* Hình ảnh sản phẩm */}
      <div className="relative mb-4 cursor-pointer" onClick={handleProductDetails}>
        <img src={props.img} alt={props.productName} className="w-full h-auto rounded-lg" />
      </div>

      {/* Tên sản phẩm */}
      <p className="text-lg font-medium text-gray-800 mb-2">{props.productName}</p>

      {/* Giá sản phẩm */}
      <div className="mb-4">
        <p className="text-xl font-bold text-red-600">
          {props.discountedPrice}đ
          {props.unit && <span className="text-sm text-gray-600">/{props.unit}</span>}
        </p>
        {props.discountPercentage > 0 && (
          <div className="flex items-center gap-2">
            <p className="text-sm text-gray-500 line-through">{props.originalPrice}đ</p>
            <p className="text-sm text-white bg-red-500 px-2 py-1 rounded">
              -{props.discountPercentage}%
            </p>
          </div>
        )}
      </div>

      {/* Nút Mua hoặc Thay đổi số lượng */}
      <div className="mt-auto">
        {isBuying ? (
          <div className="flex items-center justify-between gap-2">
            {/* Chọn số lượng */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleDecreaseQuantity}
                className="w-8 h-8 bg-gray-200 text-gray-800 font-bold rounded"
              >
                -
              </button>
              <input
                type="number"
                value={quantity}
                onChange={handleQuantityChange}
                className="w-12 text-center border border-gray-300 rounded"
              />
              <button
                onClick={handleIncreaseQuantity}
                className="w-8 h-8 bg-gray-200 text-gray-800 font-bold rounded"
              >
                +
              </button>
            </div>
          </div>
        ) : (
          <button
            onClick={() => {
              setIsBuying(true);
              handleAddToCart(quantity); // Thêm sản phẩm vào giỏ ngay lập tức
            }}
            className="w-full py-3 bg-green-500 text-white text-center font-bold text-lg rounded hover:bg-green-600"
          >
            Mua
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
