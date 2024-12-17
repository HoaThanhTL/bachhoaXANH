import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Flex from "../../designLayouts/Flex";
import { useSelector } from "react-redux";
import Category from "../../pageProps/shopPage/shopBy/Category";
import categoriesData from "../data/categoriesData";
import { paginationItems } from "../../../constants";
import { motion } from "framer-motion";
import "./HeaderBottom.css";
import axios from 'axios';

const HeaderBottom = () => {
  const location = useLocation();
  const products = useSelector((state) => state.orebiReducer.products);
  const [showUser, setShowUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authToken, setToken] = useState(""); 
  const [userData, setUserData] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Trạng thái modal xác nhận đăng xuất
  const [isLoggingOut, setIsLoggingOut] = useState(false); // Trạng thái khi đang đăng xuất

  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const searchMenuRef = useRef(null);
  const [cartCount, setCartCount] = useState(0);
  
  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filtered = paginationItems.filter((item) =>
      item.productName.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [searchQuery]);

  useEffect(() => {
    if (location.pathname === "/") {
      setShowCategory(true);
    } else {
      setShowCategory(false);
    }
  }, [location.pathname]);

  // Check for token in localStorage and fetch user data
  useEffect(() => {
    const accessToken = localStorage.getItem("authToken");
    const userId = localStorage.getItem("userId"); // Lấy userId từ localStorage
  
    if (accessToken && userId) {
      console.log("Access Token là:", accessToken);
      console.log("User ID là:", userId);
      setIsLoggedIn(true);
      setToken(accessToken);
  
      // Fetch user data sử dụng userId và accessToken
      fetch(`http://127.0.0.1:8080/api/users/current`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token không hợp lệ hoặc đã hết hạn");
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data); // Dữ liệu người dùng sẽ trả về theo định dạng như bạn đã cung cấp
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
          setIsLoggedIn(false);
          setToken("");
          // setError(error.message);  // Cập nhật lỗi nếu có
          localStorage.removeItem("authToken");
          localStorage.removeItem("userId");
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  useEffect(() => {
    if (!searchQuery) {
      setFilteredProducts([]); // Xóa kết quả tìm kiếm khi không có từ khóa
    }
  }, [searchQuery]);
  
  
  useEffect(() => {
    // Fetch sản phẩm khi có thay đổi searchQuery
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/api/products");
        const products = response.data;

        // Lọc các sản phẩm theo tên
        const filtered = products.filter((item) =>
          item.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredProducts(filtered);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    if (searchQuery.trim() !== "") {
      fetchProducts(); // Gọi API khi có searchQuery
    } else {
      setFilteredProducts([]); // Nếu không có từ khóa tìm kiếm, trả về danh sách trống
    }
  }, [searchQuery]);

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`); // Chuyển trang đến chi tiết sản phẩm theo productId
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUser(false);
      }
      if (searchMenuRef.current && !searchMenuRef.current.contains(e.target)) {
        setSearchQuery(""); // Đóng tìm kiếm khi nhấn ra ngoài
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []); 
  
  useEffect(() => {
    const fetchCartCount = async () => {
      const accessToken = localStorage.getItem("authToken");

      if (accessToken) {
        // Người dùng đã đăng nhập, gọi API để lấy giỏ hàng
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
      } else {
        // Nếu chưa đăng nhập, lấy giỏ hàng từ localStorage
        const localCart = JSON.parse(localStorage.getItem("cart")) || { items: [] };
        setCartCount(localCart.items.length); // Cập nhật số lượng sản phẩm trong giỏ hàng
      }
    };

    fetchCartCount();
  }, []);
  
  useEffect(() => {
    if (location.pathname === "/") {
      setShowCategory(true);
    } else {
      setShowCategory(false);
    }
  }, [location.pathname]);

  // Close the user menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUser(false);
      }
      if (searchMenuRef.current && !searchMenuRef.current.contains(e.target)) {
        setSearchQuery(""); // Đóng tìm kiếm khi nhấn ra ngoài
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);  

  const handleLogoutClick = () => {
    console.log('Hiển thị modal đăng xuất');
    setShowLogoutModal(true);  // Mở modal
  };

  const handleLogoutConfirm = async () => {
    setIsLoggingOut(true); 
    try {
      const token = localStorage.getItem('authToken'); // Lấy token từ localStorage
      const response = await fetch('http://127.0.0.1:8080/api/auth/logout', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,  // Gửi token nếu cần
        },
        credentials: 'include', // Gửi cookie nếu cần thiết
      });
      if (response.ok) {
        localStorage.removeItem('authToken');
        setIsLoggedIn(false);
        setUserData(null);
        setShowLogoutModal(false); 
        navigate("/"); 
      } else {
        console.error('Đăng xuất thất bại.');
      }
    } catch (error) {
      console.error('Lỗi khi đăng xuất:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  const handleLogoutCancel = () => {
    setShowLogoutModal(false); // Đóng modal khi nhấn Cancel
  };

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className=" mx-auto fixed top-10 left-0 w-full z-50 bg-[#F5F5F3] shadow-md">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* Category Toggle */}
          <div className="flex flex-row items-center gap-2 bg-[rgb(0,97,51)]  text-white cursor-pointer relative w-[20%] ">
            <HiOutlineMenuAlt4 className="w-10 h-10" onClick={() => setShowCategory(!showCategory)} />
            <p className="text-[20px] font-bold text-white bg-[rgb(0,97,51)] p-2 rounded-md">
              DANH MỤC SẢN PHẨM
            </p>

            {showCategory && (
              <motion.div
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -30, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute top-20 z-50 bg-white w-full max-w-[100%] text-[#767676] h-auto p-4 pb-6"
              >
                <Category categories={categoriesData} />
              </motion.div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
      <input
        className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
        type="text"
        onChange={handleSearch}
        value={searchQuery}
        placeholder="Tìm kiếm các sản phẩm chất lượng với OREBI"
      />
      <FaSearch className="w-5 h-5" />
      {searchQuery && filteredProducts.length > 0 && (
        <div className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
          {filteredProducts.map((item) => (
            <div
              onClick={() => handleProductClick(item.productId)} // Chuyển trang khi click vào sản phẩm
              key={item.productId}
              className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
            >
              <img className="w-24" src={item.image} alt="productImg" />
              <div className="flex flex-col gap-1">
                <p className="font-semibold text-lg">{item.name}</p>
                <p className="text-xs">{item.description}</p>
                <p className="text-sm">
                  Giá bán: <span className="text-primeColor font-semibold">{item.discountedPrice?.toLocaleString() || "N/A"}₫</span>
                </p>

              </div>
            </div>
          ))}
        </div>
      )}
    </div>

          {/* User and Cart */}
          <div style={{ fontSize: '16px' }} className="flex gap-4 mt-2 lg:mt-0 mr-[7%] text-[25px] text-white  items-center pr-6 cursor-pointer relative">
            {showUser && isLoggedIn ? (
              <div  ref={userMenuRef}>
                Xin chào, {userData ? userData.name : "Người dùng!"}
                <motion.ul
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  class="mt-2 absolute top-6 w-[300px] left-0 z-50 bg-white text-black h-auto p-4 pb-6"
                >
                  <Link to="/profile">
                    {/* <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-green hover:text-green duration-300 cursor-pointer">
                      Profile
                    </li> */}
                    <li
                    style={{ fontSize: '16px' }}
                    className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-green hover:text-green duration-300 cursor-pointer"
                  >
                     Profile
                  </li>
                  </Link>
                  <Link to="/support">
                    {/* <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-green hover:text-green duration-300 cursor-pointer">
                      Hỗ trợ khách hàng
                    </li> */}
                    <li
                    style={{ fontSize: '16px' }}
                    className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-green hover:text-green duration-300 cursor-pointer"
                  >
                     Hỗ trợ khách hàng
                  </li>
                  </Link>
                  <li
                    style={{ fontSize: '16px' }}
                    onClick={handleLogoutClick}
                    className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-green hover:text-green duration-300 cursor-pointer"
                  >
                    Đăng xuất
                  </li>
                </motion.ul>
              </div>
            ) : (
              <div onClick={() => setShowUser(!showUser)} className="flex">
                <FaUser />
                <FaCaretDown />
              </div>
            )}
            {!isLoggedIn && showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute mt-1 top-6 left-0 z-50 bg-white w-44 text-black h-auto p-4 pb-6"
              >
               <Link to="/signin">
                  <li
                    style={{ fontSize: '16px' }}
                    className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-green hover:text-green duration-300 cursor-pointer"
                  >
                    Đăng nhập
                  </li>
                </Link>

                <Link to="/signup">
                  <li 
                    style={{ fontSize: '16px' }}
                    className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-green hover:text-green duration-300 cursor-pointer">
                    Đăng ký
                  </li>
                </Link>
              </motion.ul>
            )}

            <div className="flex gap-3 items-center">
            <Link to="/cart">
      <div className="relative">
        <FaShoppingCart />
        <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
          {cartCount > 0 ? cartCount : 0}
        </span>
      </div>
    </Link>
            </div>
          </div>
        </Flex>
      </div>

      {/* Modal xác nhận đăng xuất */}
      {showLogoutModal && (
  <div className="logout-modal">
    <div className="modal-content">
      <p>Bạn muốn kết thúc phiên mua sắm?</p>
      <div className="modal-buttons">
        <button
          onClick={handleLogoutConfirm}
          disabled={isLoggingOut} // Vô hiệu hóa nút khi đang đăng xuất
          className="confirm-btn"
        >
          {isLoggingOut ? "Đang đăng xuất..." : "Đồng ý"}
        </button>
        <button onClick={handleLogoutCancel} className="cancel-btn">
          Hủy
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default HeaderBottom;
