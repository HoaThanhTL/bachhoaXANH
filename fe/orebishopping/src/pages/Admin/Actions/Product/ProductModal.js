import React, { useEffect, useState } from "react";
import { Modal, Button, Row, Col, Container, Carousel, Table } from "react-bootstrap";
import "../../../../styles/ProductModal.css";

const ProductModal = ({ isOpen, product, onClose }) => {
  const [productDetails, setProductDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (isOpen && product) {
      setLoading(true);
      setError(null);
      fetch(`http://127.0.0.1:8080/api/product-details/product/${product.productId}`)
        .then((res) => {
          if (!res.ok) {
            throw new Error(`HTTP error! status: ${res.status}`);
          }
          return res.json();
        })
        .then((data) => {
          setProductDetails(data);
          setLoading(false);
        })
        .catch((err) => {
          setError("Không thể tải chi tiết sản phẩm: " + err.message);
          setLoading(false);
        });
    }
  }, [isOpen, product]);

  if (!isOpen || !product) return null;

  return (
    <Modal
      show={isOpen}
      onHide={onClose}
      aria-labelledby="contained-modal-title-vcenter"
      size="lg"
      centered
      className="product-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">{product.name}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Container>
          {loading ? (
            <p>Đang tải thông tin...</p>
          ) : error ? (
            <p className="error-message">{error}</p>
          ) : (
            <>
              <Row>
                {/* Left Section: Image or Carousel */}
                <Col md={6} className="left-section">
                  {productDetails?.images?.length > 0 ? (
                    <Carousel interval={1000}>
                      {productDetails.images.map((img, index) => (
                        <Carousel.Item key={index}>
                          <img
                            src={img.imageUrl}
                            alt={`Ảnh ${index + 1}`}
                            className="product-carousel-img"
                          />
                        </Carousel.Item>
                      ))}
                    </Carousel>
                  ) : (
                    <img src={product.image} alt={product.name} className="product-carousel-img" />
                  )}
                </Col>

                {/* Right Section: Product Details */}
                <Col md={6} className="right-section">
                  <h5>Thông tin sản phẩm</h5>
                  <p><strong>Mã sản phẩm:</strong> {product.productId}</p>
                  <p><strong>Giá gốc:</strong> {product.originalPrice.toLocaleString()} VND</p>
                  <p><strong>Giá sau khuyến mãi:</strong> {product.discountedPrice.toLocaleString()} VND</p>
                  <p><strong>Giảm giá:</strong> {product.discountPercentage}%</p>
                  <p><strong>Đơn vị:</strong> {product.unit}</p>
                  {productDetails && (
                    <p><strong>Mô tả chi tiết:</strong> {productDetails.description || "Không có mô tả chi tiết"}</p>
                  )}
                </Col>
              </Row>

              {/* Table Section */}
              <Row className="table-row">
                <Col>
                  {productDetails?.destable?.headers && productDetails?.destable?.rows && (
                    <Table striped bordered hover size="sm">
                      <thead>
                        <tr>
                          {productDetails.destable.headers.map((header, index) => (
                            <th key={index}>{header}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {productDetails.destable.rows.map((row, rowIndex) => (
                          <tr key={rowIndex}>
                            {row.map((cell, cellIndex) => (
                              <td key={cellIndex}>{cell}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  )}
                </Col>
              </Row>
            </>
          )}
        </Container>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>Đóng</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
