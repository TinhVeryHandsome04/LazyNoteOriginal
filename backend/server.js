require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require('./routes/authRoutes');
const mongoConnect = require("./config/db");
const chatRoutes = require('./routes/chat');

// middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(bodyParser.json());

// Kết nối database
mongoConnect();

// Routes
app.use('/api', authRoutes);
app.use('/api/chat', chatRoutes);

// Khởi động server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});