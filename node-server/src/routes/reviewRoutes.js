// src/routes/reviewRoutes.js
const express = require("express");
const { extractReviews } = require("../controllers/reviewController");

const router = express.Router();

// Route for getting reviews from a product page
router.get("/", extractReviews);

module.exports = router;
