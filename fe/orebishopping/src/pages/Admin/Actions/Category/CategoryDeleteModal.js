import React from "react";
import axios from "axios";

const CategoryDeleteModal = ({ showModal, handleCloseModal, selectedCategory, refreshCategories }) => {
  const handleDelete = async () => {
    const token = localStorage.getItem("authToken");
    try {
      await axios.delete(
        `http://127.0.0.1:8080/api/categories/${selectedCategory.categoryId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      refreshCategories(); // Cập nhật lại danh sách sau khi xóa
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi xóa danh mục:", error);
    }
  };

  if (!showModal || !selectedCategory) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Xóa Danh Mục</h5>
            <button className="close" onClick={handleCloseModal}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            <p>Bạn có chắc chắn muốn xóa danh mục "{selectedCategory.name}"?</p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Đóng
            </button>
            <button className="btn btn-danger" onClick={handleDelete}>
              Xóa
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryDeleteModal;
