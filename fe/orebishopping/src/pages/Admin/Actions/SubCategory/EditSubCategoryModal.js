import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import Form from "react-bootstrap/Form";

const EditSubCategoryModal = ({
  show,
  handleClose,
  subCategory, // { subCategoryId, name, categoryId }
  categories, // List of available categories for selection
  onSaveSuccess, // Callback to refresh list after save
}) => {
  const [name, setName] = useState(subCategory?.name || "");
  const [categoryId, setCategoryId] = useState(subCategory?.categoryId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!name || !categoryId) {
      setError("Tên và danh mục cha là bắt buộc.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    const token = localStorage.getItem("authToken");
    console.log("authToken", token);

    // Sửa lại URL để chỉ truyền subCategoryId trong URL, không cần categoryId trong URL
    const url = `http://127.0.0.1:8080/api/subcategories/${subCategory.subCategoryId}`;

    // Cập nhật body với name và categoryId
    const updatedSubCategory = {
      name, // Chỉ gửi name và categoryId trong body
      categoryId: parseInt(categoryId), // Dùng parseInt để đảm bảo categoryId là số
    };

    try {
      const response = await fetch(url, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Thêm Bearer token vào header
        },
        body: JSON.stringify(updatedSubCategory), // Gửi dữ liệu dưới dạng JSON
      });

      if (response.ok) {
        handleClose();
        onSaveSuccess(); // Callback để refresh danh sách sau khi lưu
      } else {
        const errorData = await response.json();
        setError(errorData.message || "Đã xảy ra lỗi khi cập nhật.");
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Không thể kết nối đến API.");
    } finally {
      setIsSubmitting(false); // Kết thúc trạng thái loading
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Chỉnh sửa danh mục con</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group className="mb-3">
            <Form.Label>Tên danh mục con</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nhập tên danh mục con"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Danh mục cha</Form.Label>
            <Form.Select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">-- Chọn danh mục cha --</option>
              {(categories || []).map((cat) => (
                <option key={cat.categoryId} value={cat.categoryId}>
                  {cat.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          {error && <div className="text-danger mb-3">{error}</div>}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Hủy bỏ
        </Button>
        <Button variant="primary" onClick={handleSave} disabled={isSubmitting}>
          {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditSubCategoryModal;
