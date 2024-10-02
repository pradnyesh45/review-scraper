// src/routes/reviewRoutes.js
const express = require("express");
const { extractReviews } = require("../controllers/reviewController");

const router = express.Router();

// Route for getting reviews from a product page
router.get("/api/reviews", extractReviews);

router.get("/", (req, res) => {
  // Your logic to get reviews goes here
  console.log("List of reviews");
  res.json({ message: "List of reviews" });
});

module.exports = router;
