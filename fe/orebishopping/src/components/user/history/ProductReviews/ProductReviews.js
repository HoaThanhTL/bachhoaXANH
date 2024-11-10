// src/components/user/history/ProductReviews/ProductReviews.js
import React from "react";

const ProductReviews = ({ reviews }) => {
  return (
    <div className="product-reviews">
      <h2>Your Reviews</h2>
      {reviews.map((review) => (
        <div key={review.productId} className="review-item">
          <p><strong>Product:</strong> {review.productName}</p>
          <p><strong>Rating:</strong> {review.rating} stars</p>
          <p><strong>Review:</strong> {review.review}</p>
        </div>
      ))}
    </div>
  );
};

export default ProductReviews;
