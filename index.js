require('dotenv').config();
const express = require("express");
const backend = express();
const cors = require("cors");
const connectDB = require("./config/db");
const jwt = require("jsonwebtoken");
const routes = require("./Routes/index");
const path = require("path");
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-amber-pi-51.vercel.app",
];

backend.use(
  cors({
    origin: function (origin, callback) {
      // allow requests with no origin like Postman or curl
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    methods: ["POST", "GET", "DELETE", "PUT"],
    credentials: true,
  })
);

backend.use("/uploads", express.static(path.join(__dirname, "uploads")));
console.log("JWT SECRET from env:", process.env.JWT_SECRET);