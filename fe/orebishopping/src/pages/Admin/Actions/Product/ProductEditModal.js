import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../../styles/ProductEditModal.css"; // Đảm bảo rằng CSS này chỉ áp dụng cho modal này.

const ProductEditModal = ({ productId, onClose, onUpdate }) => {
  const [productData, setProductData] = useState({
    name: "",
    image: "",
    originalPrice: "",
    discountedPrice: "",
    discountPercentage: "",
    unit: "",
    description: "",
    categoryId: "",
    subCategoryId: "",
  });

  const [productDetailData, setProductDetailData] = useState({
    description: "",
    destable: {
      headers: ["Hạn sử dụng", "Nguồn gốc", "Chế biến"],
      rows: [["", "", ""]]
    },
    images: [],
  });

  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("authToken");

  // Fetch categories for the dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get("http://127.0.0.1:8080/api/categories", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy danh mục:", error);
      }
    };

    fetchCategories();
  }, [token]);

  // Fetch product and product details when modal opens
  useEffect(() => {
    if (productId) {
      // Fetch product data
      axios
        .get(`http://127.0.0.1:8080/api/products/${productId}`)
        .then((response) => {
          setProductData(response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi tải sản phẩm:", error);
        });

      // Fetch product detail data
      axios
        .get(`http://127.0.0.1:8080/api/product-details/product/${productId}`)
        .then((response) => {
          setProductDetailData(response.data);
        })
        .catch((error) => {
          console.error("Lỗi khi tải chi tiết sản phẩm:", error);
        });
    }
  }, [productId]);

  // Handle product form input change
  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    if (name === "originalPrice" || name === "discountedPrice") {
      calculateDiscountPercentage(value, name);
    }
  };

  // Calculate discount percentage
  const calculateDiscountPercentage = (value, fieldName) => {
    const originalPrice =
      fieldName === "originalPrice" ? value : productData.originalPrice;
    const discountedPrice =
      fieldName === "discountedPrice" ? value : productData.discountedPrice;

    if (originalPrice && discountedPrice) {
      const discountPercentage =
        ((originalPrice - discountedPrice) / originalPrice) * 100;
      setProductData((prev) => ({
        ...prev,
        discountPercentage: discountPercentage.toFixed(2),
      }));
    }
  };

  // Handle product detail form input change
  const handleProductDetailChange = (e) => {
    const { name, value } = e.target;
    setProductDetailData((prev) => ({ ...prev, [name]: value }));
  };

  // Handle table changes (optional)
  const handleProductDetailTableChange = (rowIndex, colIndex, value) => {
    setProductDetailData((prev) => {
      const updatedRows = [...prev.destable.rows];
      updatedRows[rowIndex][colIndex] = value;
      return {
        ...prev,
        destable: { ...prev.destable, rows: updatedRows },
      };
    });
  };

  // Save updated product
  const handleSaveProduct = () => {
    axios
      .put(`http://127.0.0.1:8080/api/products/${productId}`, productData, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        onUpdate(response.data);
        alert("Cập nhật sản phẩm thành công!");
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật sản phẩm:", error);
        alert("Cập nhật sản phẩm không thành công.");
      });
  };

  // Save updated product details
  const handleSaveProductDetail = () => {
    axios
      .put(
        `http://127.0.0.1:8080/api/product-details/${productDetailData.productDetailId}`,
        productDetailData,
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((response) => {
        alert("Cập nhật chi tiết sản phẩm thành công!");
        onUpdate(response.data); // Update in parent component
      })
      .catch((error) => {
        console.error("Lỗi khi cập nhật chi tiết sản phẩm:", error);
        alert("Cập nhật chi tiết sản phẩm không thành công.");
      });
  };

  // Handle close modal
  const handleClose = () => {
    onClose(); // Close the modal
  };

  return (
    <div className="product-edit-modal-container">
      <div className="product-edit-modal-content">
        <h2>Cập nhật sản phẩm</h2>
        <div className="product-edit-modal-body">
          {/* Left section for Product Information */}
          <div className="product-edit-left">
            <form>
              <div className="product-edit-form-group">
                <label>Tên sản phẩm</label>
                <input
                  type="text"
                  name="name"
                  value={productData.name}
                  onChange={handleProductChange}
                />
              </div>
              <div className="product-edit-form-group">
                <label>Ảnh sản phẩm</label>
                <input
                  type="text"
                  name="image"
                  value={productData.image}
                  onChange={handleProductChange}
                />
              </div>
              <div className="product-edit-form-group">
                <label>Giá gốc</label>
                <input
                  type="number"
                  name="originalPrice"
                  value={productData.originalPrice}
                  onChange={handleProductChange}
                />
              </div>
              <div className="product-edit-form-group">
                <label>Giá khuyến mãi</label>
                <input
                  type="number"
                  name="discountedPrice"
                  value={productData.discountedPrice}
                  onChange={handleProductChange}
                />
              </div>
              <div className="product-edit-form-group">
                <label>Đơn vị</label>
                <input
                  type="text"
                  name="unit"
                  value={productData.unit}
                  onChange={handleProductChange}
                />
              </div>
              <div className="product-edit-form-group">
                <label>Mô tả</label>
                <input
                  type="text"
                  name="description"
                  value={productData.description}
                  onChange={handleProductChange}
                />
              </div>
            </form>
          </div>

          {/* Right section for Product Details */}
          <div className="product-edit-right">
            <form>
              <div className="product-edit-form-group">
                <label>Chi tiết mô tả</label>
                <input
                  type="text"
                  name="description"
                  value={productDetailData.description}
                  onChange={handleProductDetailChange}
                />
              </div>
              {/* Table of product details */}
              {productDetailData.destable.rows.map((row, rowIndex) => (
                <div key={rowIndex} className="product-edit-table-row">
                  {row.map((cell, colIndex) => (
                    <input
                      key={colIndex}
                      type="text"
                      value={cell}
                      onChange={(e) =>
                        handleProductDetailTableChange(rowIndex, colIndex, e.target.value)
                      }
                      className="product-edit-table-cell"
                    />
                  ))}
                </div>
              ))}
            </form>
          </div>
        </div>

        {/* Save buttons */}
        <div className="product-edit-actions">
          <button type="button" onClick={handleSaveProduct}>
            Cập nhật sản phẩm
          </button>
          <button type="button" onClick={handleSaveProductDetail}>
            Cập nhật chi tiết sản phẩm
          </button>
        </div>

        <button className="product-edit-close-button" onClick={handleClose}>
          Đóng
        </button>
      </div>
    </div>
  );
};

export default ProductEditModal;
