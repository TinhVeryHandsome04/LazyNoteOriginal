import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { registerUser, clearError } from '../redux/authSlice';
import logo from '../images/logo.jpg';

const Register = () => {
  const [formData, setFormData] = useState({
    ho: '',
    ten: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState({});
  const [agreeTerms, setAgreeTerms] = useState(false);
  
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Nếu đã đăng nhập, chuyển hướng đến trang Dashboard
    if (isAuthenticated) {
      navigate('/dashboard');
    }
    // Xóa lỗi khi component được mount
    dispatch(clearError());
  }, [isAuthenticated, navigate, dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Xóa thông báo lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleCheckboxChange = () => {
    setAgreeTerms(!agreeTerms);
    if (errors.terms) {
      setErrors({ ...errors, terms: '' });
    }
  };

  const validate = () => {
    const newErrors = {};
    
    if (!formData.ho.trim()) {
      newErrors.ho = 'Họ không được để trống';
    }
    
    if (!formData.ten.trim()) {
      newErrors.ten = 'Tên không được để trống';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email không được để trống';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email không hợp lệ';
    }
    
    if (!formData.password) {
      newErrors.password = 'Mật khẩu không được để trống';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    }
    
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Mật khẩu không khớp';
    }
    
    if (!agreeTerms) {
      newErrors.terms = 'Bạn phải đồng ý với điều khoản và chính sách';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Kết hợp họ và tên
      const name = `${formData.ho} ${formData.ten}`.trim();
      // Loại bỏ confirmPassword và các trường không cần thiết trước khi gửi đi
      const { confirmPassword, ho, ten, ...userData } = formData;
      dispatch(registerUser({ ...userData, name }));
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
    <div className="register-container">
      <div className="register-form-wrapper">
        <h1 className="register-title">Đăng ký</h1>
        
        <div className="welcome-message">
          <p>Chào mừng đến với</p>
          <h2 className="app-name">LAZYNOTE</h2>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="ho">Họ</label>
              <input
                type="text"
                id="ho"
                name="ho"
                value={formData.ho}
                onChange={handleChange}
                className={errors.ho ? 'form-input error' : 'form-input'}
                placeholder="Lazy"
              />
              {errors.ho && <span className="error-text">{errors.ho}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="ten">Tên</label>
              <input
                type="text"
                id="ten"
                name="ten"
                value={formData.ten}
                onChange={handleChange}
                className={errors.ten ? 'form-input error' : 'form-input'}
                placeholder="Note"
              />
              {errors.ten && <span className="error-text">{errors.ten}</span>}
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'form-input error' : 'form-input'}
              placeholder="lazynote@gmail.com"
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
              className={errors.password ? 'form-input error' : 'form-input'}
              placeholder="********"
            />
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={errors.confirmPassword ? 'form-input error' : 'form-input'}
              placeholder="********"
            />
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
          </div>
          
          <div className="form-group terms-checkbox">
            <label className="checkbox-container">
              <input
                type="checkbox"
                checked={agreeTerms}
                onChange={handleCheckboxChange}
              />
              <span className="checkmark"></span>
              <span className="terms-text">Tôi đồng ý với các điều khoản & chính sách</span>
            </label>
            {errors.terms && <span className="error-text">{errors.terms}</span>}
          </div>
          
          <button type="submit" className="register-button" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'ĐĂNG KÝ'}
          </button>
        </form>
        
        <div className="login-link">
          Bạn đã có tài khoản? <Link to="/login">Đăng nhập</Link>
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

export default Register;