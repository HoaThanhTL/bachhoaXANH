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
import "./HeaderBottom";

const HeaderBottom = () => {
  const location = useLocation();
  const products = useSelector((state) => state.levenstReducer.products);
  const [showUser, setShowUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCategory, setShowCategory] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(""); 
  const [userData, setUserData] = useState(null);

  const navigate = useNavigate();
  const userMenuRef = useRef(null);
  const searchMenuRef = useRef(null);

  // Handle search input
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
    const userToken = localStorage.getItem("authToken");

    if (userToken) { 
      setIsLoggedIn(true);
      setToken(userToken);

      // Fetch user data using token
      fetch("http://127.0.0.1:8080/api/users", {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error("Token không hợp lệ hoặc đã hết hạn");
          }
          return response.json();
        })
        .then((data) => {
          setUserData(data[0]);
        })
        .catch((error) => {
          console.error("Lỗi khi lấy dữ liệu người dùng:", error);
          setIsLoggedIn(false);
          setToken("");
          localStorage.removeItem("token");
        });
    } else {
      setIsLoggedIn(false);
    }
  }, []);

  // Close the user menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setShowUser(false);
      }
      if (searchMenuRef.current && !searchMenuRef.current.contains(e.target)) {
        setSearchQuery("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      <div className="max-w-container mx-auto fixed top-10 left-0 w-full z-50 bg-[#F5F5F3] shadow-md">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* Category Toggle */}
          <div className="flex flex-col h-14 w-[20%] cursor-pointer items-center gap-2 text-primeColor relative">
            <HiOutlineMenuAlt4 className="w-10 h-10" onClick={() => setShowCategory(!showCategory)} />
            <p className="text-[14px] font-normal">DANH MỤC SẢN PHẨM</p>

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
          <div ref={searchMenuRef} className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
            <input
              className="flex-1 h-full outline-none placeholder:text-[#C4C4C4] placeholder:text-[14px]"
              type="text"
              onChange={handleSearch}
              value={searchQuery}
              placeholder="Search your products here"
            />
            <FaSearch className="w-5 h-5" />
            {searchQuery && (
              <div className="w-full mx-auto h-96 bg-white top-16 absolute left-0 z-50 overflow-y-scroll shadow-2xl scrollbar-hide cursor-pointer">
                {filteredProducts.map((item) => (
                  <div
                    onClick={() =>
                      navigate(
                        `/product/${item.productName
                          .toLowerCase()
                          .split(" ")
                          .join("")}`,
                        {
                          state: {
                            item: item,
                          },
                        }
                      )
                    }
                    key={item._id}
                    className="max-w-[600px] h-28 bg-gray-100 mb-3 flex items-center gap-3"
                  >
                    <img className="w-24" src={item.img} alt="productImg" />
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-lg">{item.productName}</p>
                      <p className="text-xs">{item.des}</p>
                      <p className="text-sm">
                        Price: <span className="text-primeColor font-semibold">${item.price}</span>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* User and Cart */}
          <div className="flex gap-4 mt-2 lg:mt-0 items-center pr-6 cursor-pointer relative">
            {showUser && isLoggedIn ? (
              <div  ref={userMenuRef}>
                Xin chào, {userData ? userData.name : "Người dùng!"}
                <motion.ul
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
                >
                  <Link to="/profile">
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Profile
                    </li>
                  </Link>
                  <Link to="/support">
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Hỗ trợ khách hàng
                    </li>
                  </Link>
                  <Link
                    to="/"
                    onClick={() => {
                      localStorage.removeItem("authToken");
                      setIsLoggedIn(false);
                      setUserData(null);
                    }}
                  >
                    <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                      Đăng xuất
                    </li>
                  </Link>
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
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                <Link to="/signin">
                  <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                    Đăng nhập
                  </li>
                </Link>
                <Link to="/signup">
                  <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
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
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link> 
            </div>
          </div>
        </Flex>
      </div>
    </div>
  );
};

export default HeaderBottom;
