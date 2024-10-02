// src/app.js
require("dotenv").config();
const express = require("express");
const reviewRoutes = require("./routes/reviewRoutes");
const cors = require("cors");

const app = express();
// const router = express.Router();

app.use(express.json());
app.use(cors());

// API routes
app.use("/", reviewRoutes);

const port = process.env.PORT || 9000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
