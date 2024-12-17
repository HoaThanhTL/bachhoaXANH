import React, { useState, useEffect } from "react";
import axios from "axios";
import "../../../../styles/AddProduct.css";

const AddProduct = () => {
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
      rows: [["", "", ""]],
    },
  });

  const handleRemoveColumn = (colIndex) => {
    setProductDetailData((prev) => ({
      ...prev,
      destable: {
        headers: prev.destable.headers.filter((_, index) => index !== colIndex),
        rows: prev.destable.rows.map((row) => row.filter((_, index) => index !== colIndex)),
      },
    }));
  };
  

  const [images, setImages] = useState([]);
  const [productId, setProductId] = useState(null);
  const [productDetailId, setProductDetailId] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);

  const [categories, setCategories] = useState([]);
  const token = localStorage.getItem("authToken");

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

  const handleProductChange = (e) => {
    const { name, value } = e.target;
    setProductData((prev) => ({ ...prev, [name]: value }));
    if (name === "originalPrice" || name === "discountedPrice") {
      calculateDiscountPercentage(value, name);
    }
  };

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

  const addProduct = async () => {
    try {
      const response = await axios.post("http://127.0.0.1:8080/api/products", productData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProductId(response.data.productId);
      alert("Sản phẩm đã được thêm thành công!");
      setCurrentStep(2);
    } catch (error) {
      console.error(error);
      alert("Thêm sản phẩm không thành công.");
    }
  };

  const handleProductDetailChange = (e) => {
    const { name, value } = e.target;
    setProductDetailData((prev) => ({ ...prev, [name]: value }));
  };

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

  const addProductDetails = async () => {
    if (!productId) return alert("Vui lòng thêm sản phẩm trước.");

    try {
      const response = await axios.post(
        "http://127.0.0.1:8080/api/product-details",
        { productId, ...productDetailData },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProductDetailId(response.data.productDetailId);
      alert("Chi tiết sản phẩm đã được thêm thành công!");
      setCurrentStep(3);
    } catch (error) {
      console.error(error);
      alert("Thêm chi tiết sản phẩm không thành công.");
    }
  };

  const uploadImages = async () => {
    if (!productDetailId) return alert("Vui lòng thêm chi tiết sản phẩm trước.");

    try {
      const formData = new FormData();
      Array.from(images).forEach((image) => formData.append("file", image));

      await axios.post(
        `http://127.0.0.1:8080/api/upload/product-image/${productDetailId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );
      alert("Hình ảnh đã được tải lên thành công!");
      alert("Tất cả các bước đã hoàn thành!");
    } catch (error) {
      console.error(error);
      alert("Tải lên hình ảnh không thành công.");
    }
  };

  const getSubCategories = () => {
    const category = categories.find(
      (cat) => cat.categoryId === parseInt(productData.categoryId)
    );
    return category ? category.subCategories || [] : [];
  };

  return (
    <div className="add-product-container">
      <div className="step-indicator">
        {[1, 2, 3].map((step) => (
          <div key={step} className={`step ${currentStep === step ? "active" : ""}`}>{step}</div>
        ))}
      </div>

      <div className="form-container">
        {currentStep === 1 && (
          <div>
            <h2 className="section-title">Thông Tin Sản Phẩm</h2>
            <div className="form-group">
              <input type="text" name="name" placeholder="Tên sản phẩm" onChange={handleProductChange} />
            </div>
            <div className="form-group">
              <input type="text" name="image" placeholder="URL Hình ảnh" onChange={handleProductChange} />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="originalPrice"
                placeholder="Giá gốc"
                value={productData.originalPrice}
                onChange={handleProductChange}
              />
            </div>
            <div className="form-group">
              <input
                type="number"
                name="discountedPrice"
                placeholder="Giá đã giảm"
                value={productData.discountedPrice}
                onChange={handleProductChange}
              />
            </div>
            <div className="form-group">
              <input
                type="text"
                name="discountPercentage"
                placeholder="Phần trăm giảm giá"
                value={productData.discountPercentage}
                readOnly
              />
            </div>
            <div className="form-group">
              <input type="text" name="unit" placeholder="Đơn vị" onChange={handleProductChange} />
            </div>
            {/* <div className="form-group">
              <textarea name="description" placeholder="Mô tả" onChange={handleProductChange}></textarea>
            </div> */}
            <div className="form-group">
              <select name="categoryId" value={productData.categoryId} onChange={handleProductChange} required>
                <option value="">Chọn Danh Mục</option>
                {categories.map((category) => (
                  <option key={category.categoryId} value={category.categoryId}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <select name="subCategoryId" value={productData.subCategoryId} onChange={handleProductChange} required>
                <option value="">Chọn Danh Mục Con</option>
                {getSubCategories().map((subCategory) => (
                  <option key={subCategory.subCategoryId} value={subCategory.subCategoryId}>
                    {subCategory.name}
                  </option>
                ))}
              </select>
            </div>
            <button onClick={addProduct}>Tiếp Tục</button>
          </div>
        )}

        {currentStep === 2 && (
          <div>
            <h2 className="section-title">Chi Tiết Sản Phẩm</h2>
            <div className="form-group">
              <textarea
                name="description"
                placeholder="Mô tả chi tiết"
                onChange={handleProductDetailChange}
              ></textarea>
            </div>
            <div className="table-container">
  <table>
    <thead>
      <tr>
        {productDetailData.destable.headers.map((header, index) => (
          <th key={index}>
            {header}
            <button
              className="remove-btn"
              onClick={() => handleRemoveColumn(index)}
            >
              X
            </button>
          </th>
        ))}
      </tr>
    </thead>
    <tbody>
      {productDetailData.destable.rows.map((row, rowIndex) => (
        <tr key={rowIndex}>
          {row.map((cell, colIndex) => (
            <td key={colIndex}>
              <input
                type="text"
                value={cell}
                onChange={(e) =>
                  handleProductDetailTableChange(
                    rowIndex,
                    colIndex,
                    e.target.value
                  )
                }
              />
            </td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
  <div className="table-controls">
    <button
      onClick={() =>
        setProductDetailData((prev) => ({
          ...prev,
          destable: {
            ...prev.destable,
            rows: prev.destable.rows.map((row) => [...row, ""]),
            headers: [...prev.destable.headers, "Cột mới"],
          },
        }))
      }
    >
      Thêm Cột
    </button>
    <button
      onClick={() =>
        setProductDetailData((prev) => ({
          ...prev,
          destable: {
            ...prev.destable,
            rows: [...prev.destable.rows, Array(prev.destable.headers.length).fill("")],
          },
        }))
      }
    >
      Thêm Dòng
    </button>
  </div>
</div>

            <button onClick={addProductDetails}>Tiếp Tục</button>
          </div>
        )}

        {currentStep === 3 && (
          <div>
            <h2 className="section-title">Tải Lên Hình Ảnh</h2>
            <div className="form-group">
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setImages(e.target.files)}
              />
            </div>
            <button onClick={uploadImages}>Hoàn Thành</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AddProduct;

