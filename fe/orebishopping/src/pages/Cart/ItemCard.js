// import React from "react";
// import { ImCross } from "react-icons/im";
// import { useDispatch } from "react-redux";
// import {
//   deleteItem,
//   drecreaseQuantity,
//   increaseQuantity,
// } from "../../redux/orebiSlice";

// const ItemCard = ({ item }) => {
//   const dispatch = useDispatch();
//   return (
//     <div className="w-full grid grid-cols-5 mb-4 border py-2">
//       <div className="flex col-span-5 mdl:col-span-2 items-center gap-4 ml-4">
//         <ImCross
//           onClick={() => dispatch(deleteItem(item._id))}
//           className="text-primeColor hover:text-red-500 duration-300 cursor-pointer"
//         />
//         <img className="w-32 h-32" src={item.image} alt="productImage" />
//         <h1 className="font-titleFont font-semibold">{item.name}</h1>
//       </div>
//       <div className="col-span-5 mdl:col-span-3 flex items-center justify-between py-4 mdl:py-0 px-4 mdl:px-0 gap-6 mdl:gap-0">
//         <div className="flex w-1/3 items-center text-lg font-semibold">
//           ${item.price}
//         </div>
//         <div className="w-1/3 flex items-center gap-6 text-lg">
//           <span
//             onClick={() => dispatch(drecreaseQuantity({ _id: item._id }))}
//             className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
//           >
//             -
//           </span>
//           <p>{item.quantity}</p>
//           <span
//             onClick={() => dispatch(increaseQuantity({ _id: item._id }))}
//             className="w-6 h-6 bg-gray-100 text-2xl flex items-center justify-center hover:bg-gray-300 cursor-pointer duration-300 border-[1px] border-gray-300 hover:border-gray-300"
//           >
//             +
//           </span>
//         </div>
//         <div className="w-1/3 flex items-center font-titleFont font-bold text-lg">
//           <p>${item.quantity * item.price}</p>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ItemCard;

// ItemCard.js
// src/components/user/profile/ItemCard.js
import React, { useState } from "react";

const ItemCard = ({ item, updateQuantity, removeProduct, handleSelectItem, isSelected }) => {
  const [quantity, setQuantity] = useState(item.quantity);

  const handleQuantityChange = (newQuantity) => {
    setQuantity(newQuantity);
    updateQuantity(newQuantity, item.productId);
  };

  return (
    <div className="flex items-center py-4 border-b border-gray-200">
      <div className="w-[5%] flex justify-center items-center">
        <input
          type="checkbox"
          checked={isSelected}
          onChange={handleSelectItem}
          className="h-5 w-5"
        />
      </div>
      
      <div className="w-[20%] flex justify-center items-center">
        <img src={item.productImage} alt={item.productName} className="w-16 h-16 object-cover" />
      </div>
      
      <div className="w-[25%]">
        <h2 className="font-semibold text-lg">{item.productName}</h2>
        <p className="text-gray-500">Giá: {item.productPrice.toLocaleString()} đ</p>
      </div>
      
      <div className="w-[25%] flex items-center justify-center">
        <button
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => handleQuantityChange(quantity - 1)}
        >
          -
        </button>
        <input
          type="text"
          value={quantity}
          className="w-12 text-center mx-2 border border-gray-300 rounded"
          readOnly
        />
        <button
          className="px-3 py-2 bg-gray-200 rounded hover:bg-gray-300"
          onClick={() => handleQuantityChange(quantity + 1)}
        >
          +
        </button>
      </div>

      <div className="w-[25%] text-right">
        <p className="font-semibold text-lg">Thành tiền: {item.productPrice * quantity} đ</p>
        <button onClick={removeProduct} className="text-red-500 hover:text-red-700">
          Xóa
        </button>
      </div>
    </div>
  );
};

export default ItemCard;


