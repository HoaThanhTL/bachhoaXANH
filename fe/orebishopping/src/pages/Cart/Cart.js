// import React, { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
// import { resetCart } from "../../redux/orebiSlice";
// import { emptyCart } from "../../assets/images/index";
// import ItemCard from "./ItemCard";

// const Cart = () => {
//   const dispatch = useDispatch();
//   const products = useSelector((state) => state.orebiReducer.products);
//   const [totalAmt, setTotalAmt] = useState("");
//   const [shippingCharge, setShippingCharge] = useState("");
//   useEffect(() => {
//     let price = 0;
//     products.map((item) => {
//       price += item.price * item.quantity;
//       return price;
//     });
//     setTotalAmt(price);
//   }, [products]);
//   useEffect(() => {
//     if (totalAmt <= 200) {
//       setShippingCharge(30);
//     } else if (totalAmt <= 400) {
//       setShippingCharge(25);
//     } else if (totalAmt > 401) {
//       setShippingCharge(20);
//     }
//   }, [totalAmt]);
//   return (
//     <div className="max-w-container mx-auto px-4">
//       <Breadcrumbs title="Cart" />
//       {products.length > 0 ? (
//         <div className="pb-20">
//           <div className="w-full h-20 bg-[#F5F7F7] text-primeColor hidden lgl:grid grid-cols-5 place-content-center px-6 text-lg font-titleFont font-semibold">
//             <h2 className="col-span-2">Mặt hàng</h2>
//             <h2>Đơn giá</h2>
//             <h2>Số lượng</h2>
//             <h2>Tổng tiền</h2>
//           </div>
//           <div className="mt-5">
//             {products.map((item) => (
//               <div key={item._id}>
//                 <ItemCard item={item} />
//               </div>
//             ))}
//           </div>

//           <button
//             onClick={() => dispatch(resetCart())}
//             className="py-2 px-10 bg-red-500 text-white font-semibold uppercase mb-4 hover:bg-red-700 duration-300"
//           >
//             Xóa hết giỏ hàng
//           </button>

//           <div className="flex flex-col mdl:flex-row justify-between border py-4 px-4 items-center gap-2 mdl:gap-0">
//             <div className="flex items-center gap-4">
//               <input
//                 className="w-44 mdl:w-52 h-8 px-4 border text-primeColor text-sm outline-none border-gray-400"
//                 type="text"
//                 placeholder="Mã giảm giá"
//               />
//               <p className="text-sm mdl:text-base font-semibold">
//                 Dùng phiếu mua hàng
//               </p>
//             </div>
//             <p className="text-lg font-semibold">Áp dụng</p>
//           </div>
//           <div className="max-w-7xl gap-4 flex justify-end mt-4">
//             <div className="w-96 flex flex-col gap-4">
//               <h1 className="text-2xl font-semibold text-right">Tổng thanh toán</h1>
//               <div>
//                 <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
//                   Tổng tiền sản phẩm
//                   <span className="font-semibold tracking-wide font-titleFont">
//                     ${totalAmt}
//                   </span>
//                 </p>
//                 <p className="flex items-center justify-between border-[1px] border-gray-400 border-b-0 py-1.5 text-lg px-4 font-medium">
//                   Phí vận chuyển
//                   <span className="font-semibold tracking-wide font-titleFont">
//                     đ{shippingCharge}
//                   </span>
//                 </p>
//                 <p className="flex items-center justify-between border-[1px] border-gray-400 py-1.5 text-lg px-4 font-medium">
//                   Đặt hàng
//                   <span className="font-bold tracking-wide text-lg font-titleFont">
//                     ${totalAmt + shippingCharge}
//                   </span>
//                 </p>
//               </div>
//               <div className="flex justify-end">
//                 <Link to="/paymentgateway">
//                   <button className="w-52 h-10 bg-primeColor text-white hover:bg-black duration-300">
//                   Thanh toán
//                   </button>
//                 </Link>
//               </div>
//             </div>
//           </div>
//         </div>
//       ) : (
//         <motion.div
//           initial={{ y: 30, opacity: 0 }}
//           animate={{ y: 0, opacity: 1 }}
//           transition={{ duration: 0.4 }}
//           className="flex flex-col mdl:flex-row justify-center items-center gap-4 pb-20"
//         >
//           <div>
//             <img
//               className="w-80 rounded-lg p-4 mx-auto"
//               src={emptyCart}
//               alt="emptyCart"
//             />
//           </div>
//           <div className="max-w-[500px] p-4 py-8 bg-white flex gap-4 flex-col items-center rounded-md shadow-lg">
//             <h1 className="font-titleFont text-xl font-bold uppercase">
//               Your Cart feels lonely.
//             </h1>
//             <p className="text-sm text-center px-10 -mt-2">
//               Your Shopping cart lives to serve. Give it purpose - fill it with
//               books, electronics, videos, etc. and make it happy.
//             </p>
//             <Link to="/shop">
//               <button className="bg-primeColor rounded-md cursor-pointer hover:bg-black active:bg-gray-900 px-8 py-2 font-titleFont font-semibold text-lg text-gray-200 hover:text-white duration-300">
//                 Continue Shopping
//               </button>
//             </Link>
//           </div>
//         </motion.div>
//       )}
//     </div>
//   );
// };

// export default Cart;
// src/components/user/profile/Cart.js
// src/components/user/profile/Cart.js
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import axios from "axios";
import ItemCard from "./ItemCard";

const Cart = () => {
  const [cart, setCart] = useState({ items: [] });
  const [totalAmt, setTotalAmt] = useState(0);
  const [selectedItems, setSelectedItems] = useState([]);
  const navigate = useNavigate();

  const fetchCart = async () => {
    try {
      const accessToken = localStorage.getItem("authToken");
      const response = await axios.get("http://127.0.0.1:8080/api/cart", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const responseData = response.data;
      const formattedCart = {
        ...responseData,
        items: responseData.items.map((item) => ({
          ...item,
          totalPrice: item.productPrice * item.quantity,
        })),
      };
      setCart(formattedCart);
    } catch (error) {
      console.error("Error fetching cart:", error);
      setCart({ items: [] });
    }
  };

  const handleCheckout = () => {
    const selectedLineItems = cart.items.filter(item => selectedItems.includes(item.lineItemId));
    if (selectedLineItems.length === 0) {
      alert("Bạn chưa chọn sản phẩm nào để thanh toán!");
      return;
    }
    navigate("/paymentgateway", {
      state: { selectedLineItems }
    });
  };

  const removeProduct = async (productId) => {
    try {
      const accessToken = localStorage.getItem("authToken");
      await axios.delete(`http://127.0.0.1:8080/api/cart/remove?productId=${productId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      fetchCart();
    } catch (error) {
      console.error("Error removing product:", error);
    }
  };

  const updateQuantity = async (newQuantity, productId) => {
    if (newQuantity === 0) {
      const confirmDelete = window.confirm("Bạn có muốn xóa sản phẩm khỏi giỏ hàng không?");
      if (confirmDelete) {
        removeProduct(productId);
      }
      return;
    }
    try {
      const accessToken = localStorage.getItem("authToken");
      await axios.put(
        `http://127.0.0.1:8080/api/cart/update?productId=${productId}&quantity=${newQuantity}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
    }
  };

  const handleSelectAll = () => {
    if (selectedItems.length === cart.items.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cart.items.map(item => item.lineItemId));
    }
  };

  const handleSelectItem = (lineItemId) => {
    if (selectedItems.includes(lineItemId)) {
      setSelectedItems(selectedItems.filter(id => id !== lineItemId));
    } else {
      setSelectedItems([...selectedItems, lineItemId]);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  useEffect(() => {
    if (cart && Array.isArray(cart.items) && cart.items.length > 0) {
      const price = cart.items.reduce((acc, item) => acc + item.totalPrice, 0);
      setTotalAmt(price);
    } else {
      setTotalAmt(0);
    }
  }, [cart]);

  const selectedTotal = cart.items
    .filter(item => selectedItems.includes(item.lineItemId))
    .reduce((acc, item) => acc + item.totalPrice, 0);

  if (!cart || !Array.isArray(cart.items) || cart.items.length === 0) {
    return (
      <div className="max-w-container mx-auto px-4">
        <Breadcrumbs title="Giỏ Hàng" />
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col justify-center items-center gap-4 pb-20"
        >
          <h1>Giỏ hàng của bạn đang trống</h1>
          <Link to="/shop" className="text-blue-500">Tiếp tục mua sắm</Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-container mx-auto px-4">
      <Breadcrumbs title="Giỏ Hàng" />
      <div className="pb-20">
        <div className="mt-5 mb-10">
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              checked={selectedItems.length === cart.items.length}
              onChange={handleSelectAll}
              className="h-5 w-5"
            />
            <label className="ml-2 text-lg">Chọn tất cả</label>
          </div>

          {cart.items.map((item) => (
            <ItemCard
              key={item.lineItemId}
              item={item}
              updateQuantity={updateQuantity}
              removeProduct={() => removeProduct(item.productId)}
              handleSelectItem={() => handleSelectItem(item.lineItemId)}
              isSelected={selectedItems.includes(item.lineItemId)}
            />
          ))}
        </div>

        <div className="flex justify-between mt-4">
          <div className="w-96 flex flex-col gap-4">
            <h1 className="text-2xl font-semibold">Tổng thanh toán giỏ hàng</h1>
            <p className="text-lg">Tổng tiền sản phẩm: {totalAmt.toLocaleString()} đ</p>
            <p className="text-lg">Tổng tiền các sản phẩm đã chọn: {selectedTotal.toLocaleString()} đ</p>
            <button onClick={handleCheckout} className="bg-blue-500 text-white py-2 rounded-lg">
              Thanh toán
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
