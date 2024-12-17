import React, { useEffect, useState } from "react"; 
import { Link } from "react-router-dom"; 
import { RiShoppingCart2Fill } from "react-icons/ri"; 
import { MdSwitchAccount } from "react-icons/md"; 
import { useSelector } from "react-redux"; 
import axios from "axios"; 

const SpecialCase = () => {
  const products = useSelector((state) => state.orebiReducer.products);
  const [cartCount, setCartCount] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("authToken");

    if (accessToken) {
      setIsAuthenticated(true); // Người dùng đã đăng nhập
      // Lấy giỏ hàng từ API nếu người dùng đã đăng nhập
      const fetchCartCount = async () => {
        try {
          const response = await axios.get("http://127.0.0.1:8080/api/cart", {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          const cartItems = response.data.items || [];
          setCartCount(cartItems.length); // Cập nhật số lượng sản phẩm trong giỏ hàng
        } catch (error) {
          console.error("Error fetching cart:", error);
          setCartCount(0); // Nếu có lỗi, đảm bảo giá trị đếm là 0
        }
      };

      fetchCartCount();
    } else {
      setIsAuthenticated(false); // Người dùng chưa đăng nhập
      // Nếu chưa đăng nhập, lấy giỏ hàng từ localStorage
      const localCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
      setCartCount(localCart.items.length); // Cập nhật số lượng sản phẩm trong giỏ hàng
    }
  }, []);

  return (
    <div className="fixed top-52 right-2 z-20 hidden md:flex flex-col gap-2">
      <Link to={isAuthenticated ? "/profile" : "/signin"}>
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer">
          <div className="flex justify-center items-center">
            <MdSwitchAccount className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />
            <MdSwitchAccount className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">{isAuthenticated ? "Profile" : "Login"}</p>
        </div>
      </Link>

      <Link to="/cart">
        <div className="bg-white w-16 h-[70px] rounded-md flex flex-col gap-1 text-[#33475b] justify-center items-center shadow-testShadow overflow-x-hidden group cursor-pointer relative">
          <div className="flex justify-center items-center">
            <RiShoppingCart2Fill className="text-2xl -translate-x-12 group-hover:translate-x-3 transition-transform duration-200" />
            <RiShoppingCart2Fill className="text-2xl -translate-x-3 group-hover:translate-x-12 transition-transform duration-200" />
          </div>
          <p className="text-xs font-semibold font-titleFont">Buy Now</p>
          <span className="absolute font-titleFont top-3 -right-0.5 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
            {cartCount > 0 ? cartCount : 0}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default SpecialCase;
