  import React, { useState, useEffect } from 'react';
  import { useDispatch, useSelector } from 'react-redux';
  import { Link, useNavigate } from 'react-router-dom';
  import { loginUser, clearError } from '../redux/authSlice';
  import logo from '../images/logo.jpg';
  import iconFb from '../images/icon-fb.png';
  import iconGg from '../images/icon-gg.png'

  const Login = () => {
    const [formData, setFormData] = useState({
      email: '',
      password: '',
    });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
      if (isAuthenticated) {
        navigate('/dashboard');
      }
    
      if (error) {
        setTimeout(() => dispatch(clearError()), 3000);  // Xóa lỗi sau 3 giây
      }
    }, [isAuthenticated, error, navigate, dispatch]);
    
    

    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData({ ...formData, [name]: value });
      // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
      if (errors[name]) {
        setErrors({ ...errors, [name]: '' });
      }
    };

    const validate = () => {
      const newErrors = {};
      if (!formData.email) {
        newErrors.email = 'Email không được để trống';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email không hợp lệ';
      }
      if (!formData.password) {
        newErrors.password = 'Mật khẩu không được để trống';
      }
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
      e.preventDefault();
      if (validate()) {
        dispatch(loginUser(formData));
      }
    };

    return (
      <div className="login-page">
        {/* Header from HomePage with logo linking to homepage */}
        <header className="header">
          <Link to="/" className="logo-container">
            <img src={logo} alt="LazyNote Logo" className="logo" />
            <span className="logo-text">LazyNote</span>
          </Link>
        </header>

        {/* Login Content */}
        <div className="login-container">
          <div className="login-card">
            <div className="login-header">
            <h1>Đăng nhập</h1>
            <p>Chào mừng trở lại <span>👋</span></p>
            <span>Đăng nhập để bắt đầu quản lý chi tiêu của bạn.</span>
            </div>

            {error && <div className="error-message">{error}</div>}

            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label htmlFor="password">Mật khẩu</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={errors.password ? 'error' : ''}
                />
                {errors.password && <span className="error-text">{errors.password}</span>}
              </div>

              <div className="remember-me-container">
                <label>
                  <input type="checkbox" /> Remember me
                </label>
                <a href="forgot-password" class="forgot-link">Quên mật khẩu?</a>
              </div>

              <button type="submit" className="login-button" disabled={loading}>
                {loading ? 'Đang xử lý...' : 'Đăng nhập'}
              </button>
            </form>

            {/* Social login */}
            <div className="social-login">
              <div className="social-login-divider">
                <span>hoặc</span>
              </div>
              <div className="social-buttons">
                <button type="button" className="social-button">
                  <img src={iconGg} alt="Google" />
                  Google
                </button>
                <button type="button" className="social-button">
                  <img src={iconFb} alt="Facebook" />
                  Facebook
                </button>
              </div>
            </div>

            <div className="register-link">
              Chưa có tài khoản? <Link to="/register">Đăng ký ngay</Link>
            </div>
          </div>
        </div>

        <footer className="footer">
          <div className="footer-content">
            <div className="footer-left">
              <img src={logo} alt="LazyNote Logo" className="footer-logo" />
              <span className="footer-logo-text">LazyNote</span>
            </div>
            <div className="footer-right">
              <span>© 2025 LazyNote. All rights reserved</span>
            </div>
          </div>
        </footer>
      </div>
    );
  };

  export default Login;