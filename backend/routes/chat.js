const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');

// Nếu bạn có middleware xác thực, thêm vào đây, ví dụ: requireAuth
// router.post('/', requireAuth, chatController.postChat);
router.post('/', chatController.postChat);

module.exports = router;
