const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const expressRateLimit = require("express-rate-limit");

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

module.exports = { register, login, loginLimiter, checkStatus };
