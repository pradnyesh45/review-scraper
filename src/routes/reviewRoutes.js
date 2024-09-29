// src/routes/reviewRoutes.js
import { Router } from "express";
import { extractReviews } from "../controllers/reviewController";

const router = Router();

// Route for getting reviews from a product page
router.get("/", extractReviews);

export default router;
