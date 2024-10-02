import React, { useState } from "react";

const ReviewForm = ({ onSubmit }) => {
  const [productUrl, setProductUrl] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(productUrl);
  };

  return (
    <div>
      <h2>Review Scraper</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Product URL"
          value={productUrl}
          onChange={(e) => setProductUrl(e.target.value)}
          required
        />
        <button type="submit">Fetch Reviews</button>
      </form>
    </div>
  );
};

export default ReviewForm;
