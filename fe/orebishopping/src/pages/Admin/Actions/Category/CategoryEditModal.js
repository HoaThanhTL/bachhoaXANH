import React, { useState, useEffect } from "react";
import axios from "axios";

const CategoryEditModal = ({
  showModal,
  handleCloseModal,
  selectedCategory,
  refreshCategories, // Nhận hàm refreshCategories từ component cha
}) => {
  const [name, setName] = useState(selectedCategory?.name || "");
  const [image, setImage] = useState(selectedCategory?.image || "");
  const [error, setError] = useState(null);

  // Cập nhật lại tên và ảnh khi selectedCategory thay đổi
  useEffect(() => {
    setName(selectedCategory?.name || "");
    setImage(selectedCategory?.image || "");
  }, [selectedCategory]);

  const handleSave = async () => {
    const token = localStorage.getItem("authToken");

    const updatedCategory = {
      categoryId: selectedCategory.categoryId,
      name,
      image,
      subCategories: selectedCategory.subCategories,
    };

    try {
      const response = await axios.put(
        `http://127.0.0.1:8080/api/categories/${selectedCategory.categoryId}`,
        updatedCategory,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Cập nhật lại danh sách danh mục sau khi sửa
      refreshCategories();

      // Đóng modal sau khi cập nhật thành công
      handleCloseModal();
    } catch (error) {
      console.error("Lỗi khi cập nhật danh mục:", error);
      setError("Có lỗi xảy ra khi cập nhật danh mục. Vui lòng thử lại.");
    }
  };

  if (!showModal || !selectedCategory) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Sửa Danh Mục</h5>
            <button className="close" onClick={handleCloseModal}>
              <span>&times;</span>
            </button>
          </div>
          <div className="modal-body">
            {error && <div className="alert alert-danger">{error}</div>} {/* Hiển thị thông báo lỗi */}
            <div className="mb-3">
              <label className="form-label">Tên danh mục</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Ảnh danh mục</label>
              <input
                type="text"
                className="form-control"
                value={image}
                onChange={(e) => setImage(e.target.value)}
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Đóng
            </button>
            <button className="btn btn-primary" onClick={handleSave}>
              Lưu thay đổi
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryEditModal;
