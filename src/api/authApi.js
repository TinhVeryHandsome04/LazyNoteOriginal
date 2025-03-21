import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Đăng nhập
export const login = async (credentials) => {
  return await axios.post(`${API_URL}/auth/login`, credentials);
};

// Đăng ký
export const register = async (userData) => {
  return await axios.post(`${API_URL}/auth/register`, userData);
};

// Đăng xuất
export const logout = async () => {
  return await axios.post(`${API_URL}/auth/logout`);
};

// Kiểm tra trạng thái đăng nhập
export const checkAuthStatus = async () => {
  return await axios.get(`${API_URL}/auth/status`);
};