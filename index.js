require('dotenv').config();
const express = require("express");
const backend = express();
const cors = require("cors");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
const routes = require("./Routes/index");

const path = require("path");
backend.use("/uploads", express.static(path.join(__dirname, "uploads")));

backend.use(
  
  cors({
    origin: "http://localhost:5173",
    methods: ["POST", "GET", "DELETE", "PUT"],
  })
);
backend.use(express.json());

backend.use(routes);
connectDB();
const PORT = process.env.PORT || 5001;
backend.listen(PORT, () => console.log(`Server running on port ${PORT}`));

console.log("JWT SECRET from env:", process.env.JWT_SECRET);