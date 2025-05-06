import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './redux/authSlice';

// Components
import Navbar from './components/Navbar';

// Pages
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import HomePage from './pages/HomePage';
import UserSettings from './pages/UserSettings';
//Bảo vệ route chỉ cho người dùng đã đăng nhập
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
};

//Bảo vệ route chỉ cho người dùng chưa đăng nhập
const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useSelector(state => state.auth);

  if (loading) {
    return <div className="loading-screen">Đang tải...</div>;
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

function App() {
  const dispatch = useDispatch();

  useEffect(() => {
    // Kiểm tra trạng thái đăng nhập khi ứng dụng khởi chạy
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <div className="app">
      <main className="main-content">
        <Routes>
          {/* Trang chủ công khai */}
          <Route path="/" element={<HomePage />} />

          {/* Routes công khai chỉ cho người dùng chưa đăng nhập */}
          <Route path="/login" element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          } />
          <Route path="/register" element={
            <PublicRoute>
              <Register />
            </PublicRoute>
          } />

          {/* Routes bảo vệ chỉ cho người dùng đã đăng nhập */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/usersettings" element={
            <ProtectedRoute>
              <UserSettings />
            </ProtectedRoute>
          } />
          {/* Xử lý các đường dẫn không hợp lệ */}
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </main>
    </div>
  );
}
export default App;