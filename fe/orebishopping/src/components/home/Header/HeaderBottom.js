import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom"; // Import useLocation
import { FaSearch, FaUser, FaCaretDown, FaShoppingCart } from "react-icons/fa";
import { HiOutlineMenuAlt4 } from "react-icons/hi";
import Flex from "../../designLayouts/Flex";
import { useSelector } from "react-redux";
import Category from "../../pageProps/shopPage/shopBy/Category";
import categoriesData from "../data/categoriesData"; // Import categoriesData
import { paginationItems } from "../../../constants";
import { motion } from "framer-motion";


const HeaderBottom = () => {
  const location = useLocation(); // Get current location (URL)
  const products = useSelector((state) => state.orebiReducer.products);
  const [showUser, setShowUser] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [showCategory, setShowCategory] = useState(false); // State to toggle category visibility

  const navigate = useNavigate();

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

  // Check if current location is "Home", and show category by default on home page
  useEffect(() => {
    if (location.pathname === "/") {
      setShowCategory(true); // Show category when on Home page
    } else {
      setShowCategory(false); // Hide category on other pages
    }
  }, [location.pathname]); // Runs every time the location changes

  return (
    <div className="w-full bg-[#F5F5F3] relative">
      {/* HeaderBottom Fixed Position */}
      <div className="max-w-container mx-auto fixed top-10 left-0 w-full z-50 bg-[#F5F5F3] shadow-md">
        <Flex className="flex flex-col lg:flex-row items-start lg:items-center justify-between w-full px-4 pb-4 lg:pb-0 h-full lg:h-24">
          {/* Category Toggle */}
          <div className="flex flex-col h-14 w-[20%] cursor-pointer items-center gap-2 text-primeColor relative">
            <HiOutlineMenuAlt4 className="w-10 h-10" onClick={() => setShowCategory(!showCategory)} />
            <p className="text-[14px] font-normal">Shop by Category</p>

            {/* Category Dropdown */}
            {(showCategory || location.pathname === "/") && (
              <motion.div
                initial={{ y: -30, opacity: 0 }} // Start from above
                animate={{ y: 0, opacity: 1 }}   // End in the normal position
                exit={{ y: -30, opacity: 0 }}    // When hiding, go up again
                transition={{ duration: 0.3 }}   // Make the transition fast and smooth
                className="absolute top-20 z-50 bg-primeColor w-full max-w-[100%] text-[#767676] h-auto p-4 pb-6"
              >
                <Category categories={categoriesData} />
              </motion.div>
            )}
          </div>

          {/* Search Bar */}
          <div className="relative w-full lg:w-[600px] h-[50px] text-base text-primeColor bg-white flex items-center gap-2 justify-between px-6 rounded-xl">
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
                {searchQuery &&
                  filteredProducts.map((item) => (
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
            <div onClick={() => setShowUser(!showUser)} className="flex">
              <FaUser />
              <FaCaretDown />
            </div>
            {showUser && (
              <motion.ul
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="absolute top-6 left-0 z-50 bg-primeColor w-44 text-[#767676] h-auto p-4 pb-6"
              >
                <Link to="/signin">
                  <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                    Login
                  </li>
                </Link>
                <Link onClick={() => setShowUser(false)} to="/signup">
                  <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                    Sign Up
                  </li>
                </Link>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Profile
                </li>
                <li className="text-gray-400 px-4 py-1 border-b-[1px] border-b-gray-400 hover:border-b-white hover:text-white duration-300 cursor-pointer">
                  Others
                </li>
              </motion.ul>
            )}
            <Link to="/cart">
              <div className="relative">
                <FaShoppingCart />
                <span className="absolute font-titleFont top-3 -right-2 text-xs w-4 h-4 flex items-center justify-center rounded-full bg-primeColor text-white">
                  {products.length > 0 ? products.length : 0}
                </span>
              </div>
            </Link>
          </div>
        </Flex>
      </div>

      {/* Add padding-top to avoid overlap with Header */}
      <div className="pt-32"></div>
    </div>
  );
};

export default HeaderBottom;
