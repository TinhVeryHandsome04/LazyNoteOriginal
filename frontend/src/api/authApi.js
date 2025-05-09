import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Cấu hình axios để gửi cookies
axios.defaults.withCredentials = true;

// Tạo instance axios với cấu hình cụ thể
const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Đăng nhập
export const login = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

// Đăng ký
export const register = async (userData) => {
  try {
    const response = await api.post('/auth/register', userData);
    return response;
  } catch (error) {
    console.error("Lỗi đăng ký:", error.response || error);
    throw error;
  }
};

// Đăng xuất
export const logout = async () => {
  return await api.post('/auth/logout');
};

// Kiểm tra trạng thái đăng nhập
export const checkAuthStatus = async () => {
  try {
    const response = await api.get('/auth/status');
    return response;
  } catch (error) {
    console.error("Lỗi kiểm tra trạng thái:", error.response || error);
    throw error;
  }
};

const authAPI = {
  login,
  register,
  logout,
  checkAuthStatus,
};

export default authAPI;
