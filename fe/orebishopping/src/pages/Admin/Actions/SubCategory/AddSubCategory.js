import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { FaPlus } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import "../../../../styles/Category.css";

const AddSubCategory = () => {
  const [subCategoryName, setSubCategoryName] = useState(""); // Tên danh mục phụ
  const [categories, setCategories] = useState([]); // Danh sách category
  const [categoryId, setCategoryId] = useState(""); // ID category được chọn
  const [isSubmitting, setIsSubmitting] = useState(false); // Trạng thái đang gửi
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [modalMessage, setModalMessage] = useState(""); // Thông báo modal
  const [modalType, setModalType] = useState(""); // Loại modal: success hoặc error
  const navigate = useNavigate();

  // Lấy danh sách category
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => alert("Không thể tải danh mục cha!"));
  }, []);

  // Xử lý gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!subCategoryName || !categoryId) {
      alert("Vui lòng nhập tên danh mục phụ và chọn danh mục cha.");
      return;
    }

    const newSubCategory = {
      name: subCategoryName, // Chỉ gửi name và categoryId trong body
      categoryId: categoryId,
    };

    console.log("Dữ liệu gửi đi:", newSubCategory);

    setIsSubmitting(true);

    // Lấy token từ localStorage
    const token = localStorage.getItem("authToken");

    try {
      const response = await fetch("http://127.0.0.1:8080/api/subcategories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSubCategory), // Gửi dữ liệu JSON
      });

      if (response.ok) {
        setModalType("success");
        setModalMessage("Thêm mới danh mục phụ thành công!");
        setShowModal(true);
      } else {
        const errorData = await response.json();
        console.error("Lỗi từ API:", errorData);
        setModalType("error");
        setModalMessage("Lỗi khi thêm danh mục phụ. Vui lòng thử lại.");
        setShowModal(true);
      }
    } catch (error) {
      console.error("Lỗi:", error);
      setModalType("error");
      setModalMessage("Có lỗi xảy ra. Vui lòng thử lại.");
      setShowModal(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="add-category-container">
      <Card className="shadow-sm p-4">
        <Card.Header className="text-center">
          <h5>Thêm mới danh mục phụ</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="subCategoryName">
              <Form.Label>Tên danh mục phụ</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục phụ"
                value={subCategoryName}
                onChange={(e) => setSubCategoryName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="categoryId">
              <Form.Label>Thuộc danh mục</Form.Label>
              <Form.Select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Chọn danh mục</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <div className="d-flex justify-content-between">
              <Button
                type="button"
                variant="secondary"
                onClick={() => navigate("/admin/categories")}
              >
                Hủy bỏ
              </Button>
              <Button
                type="submit"
                variant="success"
                disabled={isSubmitting}
                className="d-flex align-items-center"
              >
                <FaPlus className="me-2" />
                {isSubmitting ? "Đang thêm..." : "Thêm mới"}
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* Modal thông báo */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === "success" ? "Thành công!" : "Lỗi"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{modalMessage}</Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={() => setShowModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddSubCategory;
