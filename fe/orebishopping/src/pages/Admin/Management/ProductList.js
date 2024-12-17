import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../../../styles/ProductList.css";
import { FaPlus, FaPencilAlt, FaTrash, FaEye } from "react-icons/fa";
import Pagination from "../../../components/admin/Pagination";
import ProductModal from "../Actions/Product/ProductModal";
import ProductEditModal from "../Actions/Product/ProductEditModal";  // Import the ProductEditModal component

const ProductList = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(""); // subCategoryId
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);
  const [message, setMessage] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false); // Add state for controlling the ProductEditModal

  const navigate = useNavigate();

  useEffect(() => {
    fetch("http://127.0.0.1:8080/api/categories")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch(() => setMessage("Không thể tải danh mục."));
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`http://127.0.0.1:8080/api/products/subcategory/${selectedCategory}`)
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);
        })
        .catch(() => setMessage("Không thể tải sản phẩm theo danh mục."));
    } else {
      fetch("http://127.0.0.1:8080/api/products")
        .then((res) => res.json())
        .then((data) => {
          setProducts(data);
          setFilteredProducts(data);
        })
        .catch(() => setMessage("Không thể tải sản phẩm."));
    }
  }, [selectedCategory]);

  useEffect(() => {
    let filtered = products;
    if (searchTerm) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredProducts(filtered);
    setCurrentPage(1);
  }, [searchTerm, products]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handlePageChange = (page) => setCurrentPage(page);

  const openEditModal = (productId) => {
    setSelectedProduct(productId); // Set only the productId for editing
    setIsEditModalOpen(true);  // Open the edit modal
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false); // Close the edit modal
    setSelectedProduct(null); // Reset selected product
  };

  return (
    <div className="product-list-container">
      <div className="card">
        <div className="card-header">
          <h6 className="card-title">Quản lý sản phẩm</h6>
          <button className="add-button" onClick={() => navigate("/admin/add-product")}>
            <FaPlus /> Thêm mới
          </button>
        </div>

        <div className="card-body">
          {message && <p className="error-message">{message}</p>}

          {/* Search Bar and Filters */}
          <div className="search-bar">
            <input
              type="text"
              placeholder="Tìm kiếm sản phẩm..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select
              value={itemsPerPage}
              onChange={(e) => setItemsPerPage(Number(e.target.value))}
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={30}>30</option>
            </select>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">-- Chọn danh mục --</option>
              {categories.map((cat) => (
                <optgroup key={cat.categoryId} label={cat.name}>
                  {cat.subCategories.map((subCat) => (
                    <option key={subCat.subCategoryId} value={subCat.subCategoryId}>
                      {subCat.name}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Product Table */}
          <table className="table-product-list">
            <thead>
              <tr>
                <th>ID</th>
                <th>Tên</th>
                <th>Ảnh</th>
                <th>Giá</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {paginatedProducts.map((product) => (
                <tr key={product.productId}>
                  <td>{product.productId}</td>
                  <td>{product.name}</td>
                  <td>
                    <img src={product.image} alt={product.name} />
                  </td>
                  <td>{product.discountedPrice} VND</td>
                  <td>
                    {/* View Product Button */}
                    <button
                      className="action-btn"
                      onClick={() => setSelectedProduct(product)}
                    >
                      <FaEye /> Xem
                    </button>
                    {/* Edit Product Button */}
                    <button
                      className="action-btn"
                      onClick={() => openEditModal(product.productId)}  // Open edit modal with productId
                    >
                      <FaPencilAlt /> Sửa
                    </button>
                    <button className="action-btn">
                      <FaTrash /> Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination Component */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        </div>
      </div>

      {/* View Product Modal */}
      <ProductModal
        isOpen={!!selectedProduct && !isEditModalOpen}  // Show only if no edit modal is open
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

      {/* Product Edit Modal */}
      {isEditModalOpen && selectedProduct && (
        <ProductEditModal
          productId={selectedProduct} // Pass productId only
          onClose={closeEditModal}
          onUpdate={(updatedProduct) => {
            // Handle product update here
            setProducts(products.map(product => 
              product.productId === updatedProduct.productId ? updatedProduct : product
            ));
            closeEditModal();
          }}
        />
      )}
    </div>
  );
};

export default ProductList;
