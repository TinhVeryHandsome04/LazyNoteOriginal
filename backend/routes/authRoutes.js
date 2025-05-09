const express = require("express");
const authController = require("../controllers/authController");

const router = express.Router();

router.get('/auth/status', authController.checkStatus); 
router.post("/auth/register", authController.register);  // Thêm /auth/
router.post("/auth/login", authController.login);        // Thêm /auth/
router.post("/auth/forgot-password", authController.forgotPassword);
router.post("/auth/verify-otp", authController.verifyOtp);
router.post("/auth/reset-password", authController.resetPassword);
module.exports = router;
