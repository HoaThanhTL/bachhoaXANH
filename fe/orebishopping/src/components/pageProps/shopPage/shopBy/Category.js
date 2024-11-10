import React, { useState } from "react";
import { ImPlus } from "react-icons/im";
import NavTitle from "./NavTitle";
import categoriesData from "../../../home/data/categoriesData";  // Đảm bảo đường dẫn đúng

const Category = () => {
  // State để lưu trạng thái mở/đóng của subcategories cho mỗi category
  const [openCategory, setOpenCategory] = useState(null);

  // Hàm để toggle trạng thái mở/đóng của category
  const toggleSubCategories = (categoryId) => {
    if (openCategory === categoryId) {
      setOpenCategory(null); // Đóng subcategories nếu đang mở
    } else {
      setOpenCategory(categoryId); // Mở subcategories của category đó
    }
  };

  return (
    <div className="w-full">
      {/* NavTitle component */}
      <NavTitle title="Shop by Category" icons={false} />

      <div>
        <ul className="flex flex-col gap-4 text-sm lg:text-base text-[#767676]">
          {categoriesData.map((category) => (
            <li
              key={category._id}
              className="border-b-[1px] border-b-[#F0F0F0] pb-2"
            >
              {/* Category name */}
              <div
                onClick={() => toggleSubCategories(category._id)}
                className="flex items-center justify-between cursor-pointer"
              >
                <span>{category.name}</span>
                <span className="text-xs text-gray-400 hover:text-primeColor duration-300">
                  <ImPlus />
                </span>
              </div>

              {/* Nếu category đang mở thì hiển thị các subcategories */}
              {openCategory === category._id && category.subcategories.length > 0 && (
                <div className="pl-4 mt-2">
                  <ul className="space-y-3">
                    {category.subcategories.map((subcat) => (
                      <li key={subcat._id} className="flex items-center">
                        {/* Subcategory name */}
                        <span className="text-sm text-[#767676]">{subcat.name}</span>
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
