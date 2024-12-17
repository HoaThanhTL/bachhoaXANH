// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { useDispatch } from "react-redux";
// import { addToCart } from "../../../redux/orebiSlice";
// import "./Product.css";

// // Hàm format giá
// const formatCurrency = (amount) => {
//   return new Intl.NumberFormat("vi-VN").format(amount);
// };

// const Product = (props) => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [quantity, setQuantity] = useState(1);
//   const [isBuying, setIsBuying] = useState(false); // Trạng thái hiển thị khối "Mua"

//   const handleProductDetails = () => {
//     navigate(`/product/${props._id}`, {
//       state: {
//         item: props,
//       },
//     });
//   };

//   const handleAddToCart = (newQuantity) => {
//     dispatch(
//       addToCart({
//         _id: props._id,
//         name: props.productName,
//         quantity: newQuantity,
//         image: props.img,
//         price: props.discountedPrice || props.originalPrice,
//       })
//     );
//   };

//   const handleIncreaseQuantity = () => {
//     const newQuantity = quantity + 1 > 100 ? 100 : quantity + 1; // Không vượt quá 100
//     setQuantity(newQuantity);
//     handleAddToCart(newQuantity); // Cập nhật giỏ hàng
//   };

//   const handleDecreaseQuantity = () => {
//     const newQuantity = quantity - 1 < 1 ? 1 : quantity - 1; // Không nhỏ hơn 1
//     setQuantity(newQuantity);
//     handleAddToCart(newQuantity); // Cập nhật giỏ hàng
//   };

//   const handleQuantityChange = (e) => {
//     let newQuantity = parseInt(e.target.value, 10) || 1; // Chuyển về 1 nếu nhập không hợp lệ
//     if (newQuantity > 100) newQuantity = 100; // Không vượt quá 100
//     if (newQuantity < 1) newQuantity = 1; // Không nhỏ hơn 1
//     setQuantity(newQuantity);
//     handleAddToCart(newQuantity); // Cập nhật giỏ hàng
//   };

//   return (
//     <div className="product-card">
//       {/* Hình ảnh sản phẩm */}
//       <div className="relative mb-4 cursor-pointer" onClick={handleProductDetails}>
//         <img src={props.img} alt={props.productName} className="w-full h-auto rounded-lg" />
//       </div>

//       {/* Tên sản phẩm */}
//       <p className="text-lg font-medium text-gray-800 pl-2 mb-2">{props.productName}</p>

//       {/* Giá sản phẩm */}
//       <div className="mb-4 price-container pl-2">
//         <p className="text-xl font-bold price-discounted">
//           {formatCurrency(props.discountedPrice)}đ
//           {props.unit && <span className="text-sm text-gray-600">/{props.unit}</span>}
//         </p>

//         {props.discountPercentage > 0 && (
//           <div className="flex items-center gap-2">
//             <p className="text-sm price-original">
//               {formatCurrency(props.originalPrice)}đ
//             </p>
//             <p className="discount-tag">
//               -{props.discountPercentage}%
//             </p>
//           </div>
//         )}
//       </div>

//       {/* Nút Mua hoặc Thay đổi số lượng */}
//       <div className="quantity-container">
//         {isBuying ? (
//           <>
//             {/* Nút giảm số lượng */}
//             <button
//               onClick={handleDecreaseQuantity}
//               className="quantity-btn"
//             >
//               -
//             </button>

//             {/* Input số lượng */}
//             <input
//               type="number"
//               value={quantity}
//               onChange={handleQuantityChange}
//               className="quantity-input"
//             />

//             {/* Nút tăng số lượng */}
//             <button
//               onClick={handleIncreaseQuantity}
//               className="quantity-btn"
//             >
//               +
//             </button>
//           </>
//         ) : (
//           <button
//             onClick={() => {
//               setIsBuying(true);
//               handleAddToCart(quantity);
//             }}
//             className="buy-button"
//           >
//             MUA
//           </button>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Product;
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../../../redux/orebiSlice";
import axios from "axios";
import "./Product.css";

// Format the price
const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN").format(amount);
};

const Product = (props) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isBuying, setIsBuying] = useState(false);
  const [cartItems, setCartItems] = useState([]);

  // Fetch cart data from localStorage or backend
  useEffect(() => {
    const fetchCartItems = async () => {
      const accessToken = localStorage.getItem("authToken");

      if (accessToken) {
        try {
          const response = await axios.get("http://localhost:8080/api/cart", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const existingItem = response.data.items.find(
            (item) => item.productId === props._id
          );

          if (existingItem) {
            setQuantity(existingItem.quantity);
            setIsBuying(true);
          }
          setCartItems(response.data.items);
          localStorage.setItem("cart", JSON.stringify(response.data));  // Sync cart with local storage
        } catch (error) {
          console.error("Error fetching cart items:", error);
        }
      } else {
        const savedCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
        const existingItem = savedCart.items.find(item => item.productId === props._id);

        if (existingItem) {
          setQuantity(existingItem.quantity);
          setIsBuying(true);
        }

        setCartItems(savedCart.items);
      }
    };

    fetchCartItems();
  }, [props._id]);

  const handleProductDetails = () => {
    navigate(`/product/${props._id}`, {
      state: { item: props },
    });
  };

  const handleAddToCart = async (newQuantity) => {
    const accessToken = localStorage.getItem("authToken");

    if (accessToken) {
      try {
        const response = await axios.post(
          `http://127.0.0.1:8080/api/cart/add?productId=${props._id}&quantity=${newQuantity}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
        dispatch(
          addToCart({
            _id: props._id,
            name: props.productName,
            quantity: newQuantity,
            image: props.img,
            price: props.discountedPrice || props.originalPrice,
          })
        );
      } catch (error) {
        console.error("Error adding to cart:", error);
      }
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
      const updatedCart = {
        ...savedCart,
        items: [
          ...savedCart.items,
          {
            productId: props._id,
            productName: props.productName,
            quantity: newQuantity,
            price: props.discountedPrice || props.originalPrice,
            image: props.img,
          },
        ],
      };

      localStorage.setItem("cart", JSON.stringify(updatedCart));  // Sync updated cart to localStorage
      console.log("Giỏ hàng ở trạng thái dăng xuat", localStorage.getItem("cart"));
      alert("Sản phẩm đã được thêm vào giỏ hàng. Vui lòng đăng nhập để thanh toán.");
    }
  };

  const handleUpdateQuantity = async (newQuantity) => {
    const accessToken = localStorage.getItem("authToken");

    if (accessToken) {
      try {
        const response = await axios.put(
          `http://127.0.0.1:8080/api/cart/update?productId=${props._id}&quantity=${newQuantity}`,
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
    } else {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
      const updatedCart = {
        ...savedCart,
        items: savedCart.items.map(item =>
          item.productId === props._id
            ? { ...item, quantity: newQuantity }
            : item
        ),
      };
      localStorage.setItem("cart", JSON.stringify(updatedCart));  // Sync updated cart to localStorage
      setQuantity(newQuantity);
    }
  };

  const handleIncreaseQuantity = () => {
    const newQuantity = Math.min(quantity + 1, 100);
    handleUpdateQuantity(newQuantity);
  };

  const handleDecreaseQuantity = () => {
    const newQuantity = Math.max(quantity - 1, 1);
    handleUpdateQuantity(newQuantity);
  };

  const handleQuantityChange = (e) => {
    let newQuantity = parseInt(e.target.value, 10) || 1;
    if (newQuantity > 100) newQuantity = 100;
    if (newQuantity < 1) newQuantity = 1;
    handleUpdateQuantity(newQuantity);
  };

  return (
    <div className="product-card">
      <div className="relative mb-4 cursor-pointer" onClick={handleProductDetails}>
        <img src={props.img} alt={props.productName} className="w-full h-auto rounded-lg" />
      </div>
      <p className="text-lg font-medium text-gray-800 pl-2 mb-2">{props.productName}</p>
      <div className="mb-4 price-container pl-2">
        <p className="text-xl font-bold price-discounted">
          {formatCurrency(props.discountedPrice)}đ
        </p>
        {props.discountPercentage > 0 && (
          <div className="flex items-center gap-2">
            <p className="text-sm price-original">
              {formatCurrency(props.originalPrice)}đ
            </p>
            <p className="discount-tag">-{props.discountPercentage}%</p>
          </div>
        )}
      </div>
      <div className="quantity-container">
        {isBuying ? (
          <>
            <button onClick={handleDecreaseQuantity} className="quantity-btn">-</button>
            <input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              className="quantity-input"
            />
            <button onClick={handleIncreaseQuantity} className="quantity-btn">+</button>
          </>
        ) : (
          <button onClick={() => { setIsBuying(true); handleAddToCart(quantity); }} className="buy-button">
            MUA
          </button>
        )}
      </div>
    </div>
  );
};

export default Product;
