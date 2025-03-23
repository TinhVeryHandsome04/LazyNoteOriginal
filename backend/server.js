require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authRoutes");
const mongoConnect = require("./config/db");
const chatRoutes = require("./routes/chatRoutes");
//middleware
app.use(cors());
app.use(bodyParser.json());

mongoConnect();

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server is running on http://localhost:${process.env.PORT}`);
});
