import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Lấy danh sách chi tiêu
export const fetchExpenses = async (params = {}) => {
  return await axios.get(`${API_URL}/expenses`, { params });
};

// Thêm chi tiêu mới
export const addExpense = async (expenseData) => {
  return await axios.post(`${API_URL}/expenses`, expenseData);
};

// Cập nhật chi tiêu
export const updateExpense = async (id, expenseData) => {
  return await axios.put(`${API_URL}/expenses/${id}`, expenseData);
};

// Xóa chi tiêu
export const deleteExpense = async (id) => {
  return await axios.delete(`${API_URL}/expenses/${id}`);
};

// Lấy báo cáo chi tiêu
export const getExpenseReport = async (params = {}) => {
  return await axios.get(`${API_URL}/expenses/report`, { params });
};