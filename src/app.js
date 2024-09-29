// src/app.js
require("dotenv").config();
import express, { json } from "express";
import reviewRoutes from "./routes/reviewRoutes.js";

const app = express();

app.use(json());

// API route for reviews
app.use("/api/reviews", reviewRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
