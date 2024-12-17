// CategoryModal.js
import React from "react";

const CategoryModal = ({ showModal, handleCloseModal, selectedCategory }) => {
  if (!showModal || !selectedCategory) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Xem Danh Mục</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <div>
              <strong>Tên Danh Mục:</strong> {selectedCategory.name}
            </div>
            <div>
              <strong>Ảnh:</strong>{" "}
              <img src={selectedCategory.image} alt={selectedCategory.name} width={100} />
            </div>
            <div>
              <strong>Danh Mục Con:</strong>
              <ul>
                {selectedCategory.subCategories &&
                  selectedCategory.subCategories.map((sub, index) => (
                    <li key={index}>{sub.name}</li>
                  ))}
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={handleCloseModal}>
              Đóng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryModal;
