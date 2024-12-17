import React, { useState, useEffect } from "react";
import { FaSearch, FaEye, FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CategoryModal from "../Actions/Category/CategoryModal";
import CategoryEditModal from "../Actions/Category/CategoryEditModal";
import CategoryDeleteModal from "../Actions/Category/CategoryDeleteModal";
import Pagination from "../../../components/admin/Pagination";
import "../../../styles/UserList.css";
import "../../../styles/ProductList.css";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = () => {
    fetch("http://127.0.0.1:8080/api/categories")
      .then((res) => res.json())
      .then((data) => {
        setCategories(data);
        setFilteredCategories(data);
      })
      .catch(() => console.error("Không thể tải danh mục."));
  };

  useEffect(() => {
    const filtered = categories.filter((category) =>
      category.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCategories(filtered);
    setCurrentPage(1);
  }, [searchTerm, categories]);

  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = filteredCategories.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);
  const handleItemsPerPageChange = (e) => setItemsPerPage(Number(e.target.value));

  const handleShowViewModal = (category) => {
    setSelectedCategory(category);
    setShowViewModal(true);
  };

  const handleShowEditModal = (category) => {
    setSelectedCategory(category);
    setShowEditModal(true);
  };

  const handleShowDeleteModal = (category) => {
    setSelectedCategory(category);
    setShowDeleteModal(true);
  };

  const handleCloseModal = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
  };

  const handleAddCategory = () => {
    navigate("/admin/add-category", { state: { fromCategoryList: true } });
  };

  return (
    <div className="user-list-container">
      <div className="card">
        <div className="card-header d-flex justify-content-between align-items-center">
          <h6 className="card-title">Quản lý danh mục</h6>
          <button className="btn btn-success" onClick={handleAddCategory}>
            <FaPlus className="me-2" /> Thêm mới
          </button>
        </div>
        <div className="card-body">
          <div className="search-container">
            <div className="search-input-container">
              <FaSearch className="search-icon" />
              <input
                type="text"
                className="search-input"
                placeholder="Tìm kiếm danh mục..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div>
              <select
                value={itemsPerPage}
                onChange={handleItemsPerPageChange}
                className="form-select"
              >
                <option value="5">5 dòng</option>
                <option value="10">10 dòng</option>
                <option value="15">15 dòng</option>
              </select>
            </div>
          </div>
          <table className="table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Ảnh</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedCategories.map((category) => (
                <tr key={category.categoryId}>
                  <td>{category.categoryId}</td>
                  <td>{category.name}</td>
                  <td>
                    <img src={category.image} alt={category.name} width={50} />
                  </td>
                  <td>
                    <button
                      className="btn btn-info me-2"
                      onClick={() => handleShowViewModal(category)}
                    >
                      <FaEye /> Xem
                    </button>
                    <button
                      className="btn btn-warning me-2"
                      onClick={() => handleShowEditModal(category)}
                    >
                      <FaEdit /> Sửa
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleShowDeleteModal(category)}
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
            handlePageChange={handlePageChange}
          />
        </div>
      </div>

      {/* Modal Xem */}
      <CategoryModal
        showModal={showViewModal}
        handleCloseModal={handleCloseModal}
        selectedCategory={selectedCategory}
      />
      
      {/* Modal Sửa */}
      <CategoryEditModal
        showModal={showEditModal}
        handleCloseModal={handleCloseModal}
        selectedCategory={selectedCategory}
        refreshCategories={fetchCategories} // Truyền lại hàm fetchCategories
      />
      
      {/* Modal Xóa */}
      <CategoryDeleteModal
        showModal={showDeleteModal}
        handleCloseModal={handleCloseModal}
        selectedCategory={selectedCategory}
        refreshCategories={fetchCategories} // Truyền lại hàm fetchCategories
      />
    </div>
  );
};

export default CategoryList;
