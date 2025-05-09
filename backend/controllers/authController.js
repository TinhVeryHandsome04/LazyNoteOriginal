const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const expressRateLimit = require("express-rate-limit");
const nodemailer = require('nodemailer');

// Middleware giới hạn tần suất login
const loginLimiter = expressRateLimit({
  windowMs: 15 * 60 * 1000, // 15 phút
  max: 5, // Mỗi IP chỉ được 5 lần login trong 15 phút
  message: "Quá nhiều lần đăng nhập, vui lòng thử lại sau.",
});

// Đăng ký người dùng
const register = async (req, res) => {
  const { username, email, password } = req.body;

  // Kiểm tra đầu vào
  if (!username || !email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin." });
  }

  // Kiểm tra mật khẩu phải dài tối thiểu 6 ký tự và có sự kết hợp của chữ cái và số
  if (password.length < 6) {
    return res.status(400).json({ message: "Mật khẩu phải có ít nhất 6 ký tự." });
  }

  try {
    // Kiểm tra email và username đã tồn tại
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email đã được sử dụng." });
    }

    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json({ message: "Username đã được sử dụng." });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Tạo người dùng mới
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: "Đăng ký người dùng thành công. Vui lòng đăng nhập." });
  } catch (error) {
    console.error(error);

    // Kiểm tra lỗi khi có trùng lặp thông tin trong cơ sở dữ liệu
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ message: `${field} đã tồn tại.` });
    }

    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau.", error });
  }
};

// Đăng nhập
const login = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra đầu vào
  if (!email || !password) {
    return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin đăng nhập." });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ." });
    }

    // Kiểm tra mật khẩu
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Thông tin đăng nhập không hợp lệ." });
    }

    // Tạo token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "72h", // Token hết hạn sau 72 giờ
    });

    res.json({
      token,
      user: { id: user._id, username: user.username, email: user.email },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Lỗi máy chủ, vui lòng thử lại sau.", error });
  }
};

// Kiểm tra trạng thái API
const checkStatus = (req, res) => {
  res.status(200).json({ message: "API đang hoạt động bình thường." });
};

// Hàm sinh OTP ngẫu nhiên 6 số
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ message: "Vui lòng nhập email." });
  }

  // Chỉ cho phép email Gmail
  if (!/^[\w.+-]+@gmail\.com$/i.test(email)) {
    return res.status(400).json({ message: "Chỉ hỗ trợ gửi OTP tới địa chỉ Gmail." });
  }

  // Kiểm tra user tồn tại
  const user = await User.findOne({ email });
  if (!user) {
    // Trả về thành công để tránh lộ thông tin email
    return res.status(200).json({ message: "OTP đã được gửi về email nếu tài khoản tồn tại." });
  }

  // Sinh OTP và lưu vào user
  const otp = generateOTP();
  user.resetOTP = otp;
  user.resetOTPExpire = Date.now() + 10 * 60 * 1000; // 10 phút
  await user.save();

  // Gửi email
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER, // email gửi đi
      pass: process.env.EMAIL_PASS, // mật khẩu ứng dụng
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Mã OTP đặt lại mật khẩu',
    text: `Mã OTP của bạn là: ${otp}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    return res.json({ message: "OTP đã được gửi về email nếu tài khoản tồn tại." });
  } catch (err) {
    console.error('Lỗi gửi mail:', err);
    return res.status(500).json({ message: "Không gửi được OTP về email." });
  }
};

const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ message: "Thiếu email hoặc mã OTP." });
  }
  const user = await User.findOne({ email });
  if (!user || !user.resetOTP || !user.resetOTPExpire) {
    return res.status(400).json({ message: "OTP không hợp lệ." });
  }
  if (user.resetOTP !== otp) {
    return res.status(400).json({ message: "Mã OTP không đúng." });
  }
  if (user.resetOTPExpire < Date.now()) {
    return res.status(400).json({ message: "Mã OTP đã hết hạn." });
  }
  // Xác thực thành công, cho phép đổi mật khẩu
  return res.json({ message: "OTP hợp lệ." });
};

const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  if (!email || !otp || !newPassword) {
    return res.status(400).json({ message: "Thiếu thông tin." });
  }
  const user = await User.findOne({ email });
  if (!user || !user.resetOTP || !user.resetOTPExpire) {
    return res.status(400).json({ message: "OTP không hợp lệ." });
  }
  if (user.resetOTP !== otp) {
    return res.status(400).json({ message: "Mã OTP không đúng." });
  }
  if (user.resetOTPExpire < Date.now()) {
    return res.status(400).json({ message: "Mã OTP đã hết hạn." });
  }
  // Đặt lại mật khẩu
  user.password = await bcrypt.hash(newPassword, 10);
  user.resetOTP = undefined;
  user.resetOTPExpire = undefined;
  await user.save();
  return res.json({ message: "Đặt lại mật khẩu thành công." });
};

module.exports = {
  register,
  login,
  loginLimiter,
  checkStatus,
  forgotPassword,
  verifyOtp,
  resetPassword
};
