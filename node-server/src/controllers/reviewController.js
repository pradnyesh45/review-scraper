// src/controllers/reviewController.js
const { scrapeReviews } = require("../services/scrapingService");
const { scrapeReviewsV2 } = require("../services/scrapingServiceV2");

exports.extractReviews = async (req, res) => {
  const productUrl = req.query.page;

  if (!productUrl) {
    return res.status(400).json({ error: "Product URL is required" });
  }

  try {
    console.log("Fetching reviews from:", productUrl);
    const reviewsData = await scrapeReviews(productUrl);
    console.log("Reviews fetched successfully");
    return res.status(200).json(reviewsData);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    return res.status(500).json({ error: "Failed to extract reviews" });
  }
};

exports.extractReviewsV2 = async (req, res) => {
  const productUrl = req.query.page;

  if (!productUrl) {
    return res.status(400).json({ error: "Product URL is required" });
  }

  try {
    console.log("Fetching reviews from:", productUrl);
    const reviewsData = await scrapeReviewsV2(productUrl);
    console.log("Reviews fetched successfully");
    return res.status(200).json(reviewsData);
  } catch (error) {
    console.error("Error fetching reviews:", error.message);
    return res.status(500).json({ error: "Failed to extract reviews" });
  }
};
