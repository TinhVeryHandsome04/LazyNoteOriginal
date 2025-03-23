const { chat } = require('../controllers/chatController');
const { auth } = require('../middleware/authMiddleware');

const express = require('express');
const router = express.Router();

router.post('/chat', auth, chat);

module.exports = router;