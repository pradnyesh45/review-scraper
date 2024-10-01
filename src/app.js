// src/app.js
require("dotenv").config();
const express = require("express");
const reviewRoutes = require("./routes/reviewRoutes");

const app = express();

app.use(express.json());

// API route for reviews
app.use("/api/reviews", reviewRoutes);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
