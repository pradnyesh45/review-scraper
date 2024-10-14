// src/routes/reviewRoutes.js
const express = require("express");
const {
  extractReviews,
  extractReviewsV2,
} = require("../controllers/reviewController");

const router = express.Router();

// Route for getting reviews from a product page
router.get("/api/reviewsV1", extractReviews);
router.get("/api/reviewsV2", extractReviewsV2);

router.get("/", (req, res) => {
  // landing page
  console.log("List of reviews");
  res.json({ message: "List of reviews" });
});

module.exports = router;
