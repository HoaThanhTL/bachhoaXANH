import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import { FaPlus } from "react-icons/fa";
import Modal from "react-bootstrap/Modal";
import "../../../../styles/Category.css";

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categories, setCategories] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalType, setModalType] = useState(""); // "success" or "error"
  const navigate = useNavigate();

  // Lấy danh sách danh mục để tính ID
  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => alert("Không thể tải danh mục!"));
  }, []);

  const handleFileChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name || !image) {
      alert("Vui lòng nhập tên danh mục và chọn ảnh.");
      return;
    }

    const maxId = categories.reduce((max, cat) => Math.max(max, cat.categoryId), 0);
    const newId = maxId + 1;

    const newCategory = {
      categoryId: newId,
      name: name,
      image: image.name,
    };

    console.log("Dữ liệu gửi đi:", newCategory);

    setIsSubmitting(true);

    // Lấy token từ localStorage
    const token = localStorage.getItem("authToken");
    console.log("category token:", token);

    try {
      const response = await fetch("http://127.0.0.1:8080/api/categories", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newCategory), // Gửi dữ liệu JSON
      });

      if (response.ok) {
        setModalType("success");
        setModalMessage("Thêm mới danh mục thành công!");
        // Khi thành công, người dùng có thể tiếp tục hoặc quay lại
        setShowModal(true);
      } else {
        const errorData = await response.json();
        console.error("Lỗi từ API:", errorData);
        setModalType("error");
        setModalMessage("Lỗi khi thêm danh mục. Vui lòng thử lại.");
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

  const handleContinueAdding = () => {
    setName("");
    setImage(null);
    setShowModal(false);
  };

  const handleGoBack = () => {
    navigate("/admin/categories"); // Điều hướng về trang trước
  };

  return (
    <div className="add-category-container">
      <Card className="shadow-sm p-4">
        <Card.Header className="text-center">
          <h5>Thêm mới danh mục</h5>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="categoryName">
              <Form.Label>Tên danh mục</Form.Label>
              <Form.Control
                type="text"
                placeholder="Nhập tên danh mục"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="categoryImage">
              <Form.Label>Chọn ảnh</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                required
              />
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
          {modalType === "success" ? (
            <>
              <Button variant="primary" onClick={handleContinueAdding}>
                Tiếp tục thêm mới
              </Button>
              <Button variant="secondary" onClick={handleGoBack}>
                Quay lại trang trước
              </Button>
            </>
          ) : (
            <Button variant="primary" onClick={() => setShowModal(false)}>
              Đóng
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AddCategory;
