import React, { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";

const SubCategoryModal = ({ showModal, handleCloseModal, selectedSubCategory }) => {
  const [products, setProducts] = useState([]); // Danh sách sản phẩm
  const [isLoading, setIsLoading] = useState(false); // Trạng thái tải dữ liệu
  const [error, setError] = useState(""); // Lỗi khi tải dữ liệu

  useEffect(() => {
    if (!showModal) {
      setProducts([]);
      setError("");
    }
  }, [showModal]);

  const fetchProducts = async () => {
    if (!selectedSubCategory) return;

    setIsLoading(true);
    setError("");

    const url = `http://127.0.0.1:8080/api/products/subcategory/${selectedSubCategory.subCategoryId}`;
    try {
      const token = localStorage.getItem("authToken");
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProducts(data);
      } else {
        setError("Không thể tải danh sách sản phẩm.");
      }
    } catch (err) {
      console.error("Lỗi kết nối:", err);
      setError("Lỗi kết nối đến API.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!showModal || !selectedSubCategory) return null;

  return (
    <div className="modal" style={{ display: "block" }}>
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Xem Danh Mục Con</h5>
            <button type="button" className="btn-close" onClick={handleCloseModal}></button>
          </div>
          <div className="modal-body">
            <div>
              <strong>Tên Danh Mục Con:</strong> {selectedSubCategory.name}
            </div>
            <div>
              <strong>Ảnh:</strong>{" "}
              <img
                src={selectedSubCategory.image}
                alt={selectedSubCategory.name}
                width={100}
              />
            </div>
            <div>
              <strong>Mô tả:</strong> {selectedSubCategory.description || "Không có mô tả"}
            </div>
            <div>
              <strong>Danh sách sản phẩm:</strong>
              <Button
                variant="primary"
                onClick={fetchProducts}
                disabled={isLoading}
                className="mt-2"
              >
                {isLoading ? "Đang tải..." : "Xem thêm sản phẩm"}
              </Button>
              {error && <div className="text-danger mt-2">{error}</div>}
              <ul className="mt-3">
                {products.map((product, index) => (
                  <li key={index}>
                    <strong>{product.name}</strong> - Giá: {product.price} VND
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="modal-footer">
            <Button variant="secondary" onClick={handleCloseModal}>
              Đóng
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubCategoryModal;
