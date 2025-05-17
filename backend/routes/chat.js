const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chatController");
const middleWare = require("./../middleware/authMiddleware");
router.post("/", middleWare, chatController.postChat);

module.exports = router;
