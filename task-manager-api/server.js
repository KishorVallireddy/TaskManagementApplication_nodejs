require("dotenv").config();
const connectDB = require("./src/config/db");
const app = require("./src/app");
const cors = require('cors');
const express = require('express');


// ✅ HANDLE OPTIONS FIRST (VERY IMPORTANT)
app.use((req, res, next) => {
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// ✅ CORS CONFIG
app.use(cors({
  origin: 'http://localhost:4200', // Angular URL
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

connectDB();
app.listen(3000, () => console.log("Server running on port 3000"));
