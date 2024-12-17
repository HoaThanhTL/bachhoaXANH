import React, { useState, useEffect } from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import { useNavigate } from "react-router-dom";
const Category = () => {
  const navigate = useNavigate();
  // State để lưu danh sách category từ API và trạng thái mở/đóng của subcategories
  const [categories, setCategories] = useState([]);
  const [openCategory, setOpenCategory] = useState(null);

  // Hàm để toggle trạng thái mở/đóng của category
  const toggleSubCategories = (categoryId) => {
    if (openCategory === categoryId) {
      setOpenCategory(null); // Đóng subcategories nếu đang mở
    } else {
      setOpenCategory(categoryId); // Mở subcategories của category đó
    }
  };

  // Hàm gọi API để lấy danh sách categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch("http://127.0.0.1:8080/api/categories");
        const data = await response.json();
        setCategories(data); // Lưu dữ liệu vào state
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories(); // Gọi API khi component mount
  }, []); // Chạy chỉ một lần khi component mount

  return (
    <div className="w-full">
      {/* NavTitle component */}
      <NavTitle title="KHUYẾN MÃI SỐC" icons={false} />

      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {categories.map((category) => (
            <li
              key={category.categoryId}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2"
            >
              {/* Category name */}
              <div
                onClick={() => toggleSubCategories(category.categoryId)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{category.name}</span>
                <span className="text-xs text-gray-400 hover:text-primeColor duration-300">
                  <ImPlus />
                </span>
              </div>

              {/* Nếu category đang mở thì hiển thị các subcategories */}
              {openCategory === category.categoryId && category.subCategories.length > 0 && (
              <div className="pl-4 mt-2">
                <ul className="space-y-3">
                  {category.subCategories.map((subcat) => (
                    <li
                      key={subcat.subCategoryId}
                      className="flex items-center cursor-pointer"
                      onClick={() => navigate(`/subcategory/${subcat.subCategoryId}`)} // Thêm sự kiện chuyển hướng
                    >
                      <span className="text-sm text-[#767676] hover:underline">{subcat.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Category;
