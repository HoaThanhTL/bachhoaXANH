import React, { useState, useEffect } from "react";
import "../../../styles/UserList.css";
import "../../../styles/ProductList.css";
import { useNavigate } from "react-router-dom";
import { FaPlus, FaPencilAlt, FaTrash, FaEye } from "react-icons/fa";
import Pagination from "../../../components/admin/Pagination";
import SubCategoryModal from "../Actions/SubCategory/SubCategoryModal";
import EditSubCategoryModal from "../Actions/SubCategory/EditSubCategoryModal";
import DeleteSubCategoryModal from "../Actions/SubCategory/DeleteSubCategoryModal";

const SubCategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [subCategories, setSubCategories] = useState([]);
  const [filteredSubCategories, setFilteredSubCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);

  const navigate = useNavigate();

  // Fetch categories
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setMessage("Không thể tải danh mục."));
  }, []);

  // Fetch subcategories
  const fetchSubCategories = () => {
    if (selectedCategory) {
      fetch(`http://127.0.0.1:8080/api/subcategories/category/${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          setSubCategories(data);
          setFilteredSubCategories(data);
        })
        .catch(() => setMessage("Không thể tải danh mục phụ theo danh mục."));
    } else {
      fetch("http://127.0.0.1:8080/api/subcategories")
        .then((res) => res.json())
        .then((data) => {
          setSubCategories(data);
          setFilteredSubCategories(data);
        })
        .catch(() => setMessage("Không thể tải danh mục phụ."));
    }
  };

  useEffect(() => {
    fetchSubCategories();
  }, [selectedCategory]);

  // Handle search functionality
  useEffect(() => {
    let filtered = subCategories;
    if (searchTerm) {
      filtered = filtered.filter((subCategory) =>
        subCategory.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSubCategories(filtered);
    setCurrentPage(1);
  }, [searchTerm, subCategories]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredSubCategories.length / itemsPerPage);
  const paginatedSubCategories = filteredSubCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const handleAddSubCategory = () => {
    navigate("/admin/add-subcategory", { state: { fromSubCategoryList: true } });
  };

  // Refresh SubCategory List
  const refreshSubCategoryList = () => {
    fetchSubCategories();
    setMessage(""); // Clear any error message
  };

  return (
    <div className="sub-category-list-container">
      <div className="card">
        <div className="card-header">
          <h6 className="card-title">Quản lý danh mục phụ</h6>
          <button className="btn btn-success" onClick={handleAddSubCategory}>
            <FaPlus className="me-2" /> Thêm mới
          </button>
        </div>

        <div className="card-body">
          {message && <p className="error-message">{message}</p>}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm danh mục phụ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={5}>5</option>
              <option value={10}>10</option>
              <option value={20}>20</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Danh mục cha</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedSubCategories.map((subCategory) => (
                <tr key={subCategory.subCategoryId}>
                  <td>{subCategory.subCategoryId}</td>
                  <td>{subCategory.name}</td>
                  <td>{subCategory.categoryName}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSelectedSubCategory(subCategory);
                        setShowViewModal(true);
                      }}
                    >
                      <FaEye /> Xem
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSelectedSubCategory(subCategory);
                        setShowEditModal(true);
                      }}
                    >
                      <FaPencilAlt /> Sửa
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => {
                        setSelectedSubCategory(subCategory);
                        setShowDeleteModal(true);
                      }}
                    >
                      <FaTrash /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* SubCategory Modal */}
      {showViewModal && (
        <SubCategoryModal
          showModal={showViewModal} // Hiển thị modal
          handleCloseModal={() => setShowViewModal(false)} // Đóng modal
          selectedSubCategory={selectedSubCategory} // Danh mục con được chọn
        />
      )}


      {/* Edit SubCategory Modal */}
    {showEditModal && (
      <EditSubCategoryModal
        show={showEditModal} // Điều khiển hiển thị
        subCategory={selectedSubCategory} // Danh mục cần chỉnh sửa
        categories={categories} // Danh sách danh mục cha
        handleClose={() => setShowEditModal(false)} // Đóng modal
        onSaveSuccess={refreshSubCategoryList} // Làm mới danh sách sau khi lưu
      />
    )}

{/* Delete SubCategory Modal */}
{showDeleteModal && (
  <DeleteSubCategoryModal
    showModal={showDeleteModal} // Hiển thị modal
    handleCloseModal={() => setShowDeleteModal(false)} // Đóng modal
    selectedSubCategory={selectedSubCategory} // Danh mục con được chọn để xóa
    onDeleteSuccess={refreshSubCategoryList} // Gọi lại API danh sách sau khi xóa
  />
)}

    </div>
  );
};

export default SubCategoryList;
