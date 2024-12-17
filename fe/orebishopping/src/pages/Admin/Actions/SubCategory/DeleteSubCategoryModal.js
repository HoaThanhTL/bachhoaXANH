import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

const DeleteSubCategoryModal = ({
  showModal,
  handleCloseModal,
  selectedSubCategory, // Danh mục con được chọn
  onDeleteSuccess, // Callback để cập nhật giao diện sau khi xóa thành công
}) => {
  const [isDeleting, setIsDeleting] = useState(false); // Trạng thái xóa
  const [error, setError] = useState(""); // Thông báo lỗi

  const handleDelete = async () => {
    if (!selectedSubCategory) return;

    setIsDeleting(true);
    setError(""); // Xóa lỗi cũ

    const url = `http://127.0.0.1:8080/api/subcategories/${selectedSubCategory.subCategoryId}`; // Sửa URL đúng với API

    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        onDeleteSuccess(); // Gọi callback để cập nhật danh sách sau khi xóa thành công
        handleCloseModal(); // Đóng modal
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Không thể xóa danh mục con.");
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Không thể kết nối đến API.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!showModal || !selectedSubCategory) return null;

  return (
    <Modal show={showModal} onHide={handleCloseModal}>
      <Modal.Header closeButton>
        <Modal.Title>Xóa Danh Mục Con</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <p>
          Bạn có chắc chắn muốn xóa danh mục con{" "}
          <strong>{selectedSubCategory.name}</strong> không?
        </p>
        {error && <div className="text-danger">{error}</div>}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleCloseModal}>
          Hủy bỏ
        </Button>
        <Button
          variant="danger"
          onClick={handleDelete}
          disabled={isDeleting}
        >
          {isDeleting ? "Đang xóa..." : "Xóa"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default DeleteSubCategoryModal;
