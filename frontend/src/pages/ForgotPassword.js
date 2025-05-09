import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/logo.jpg';
import axios from 'axios';
import '../style/ForgotPassword.css';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Gọi API forgot password
const forgotPassword = async (email) => {
  if (!email) {
    return { status: 400, data: { message: "Vui lòng nhập email." } };
  }

  // Chỉ cho phép email Gmail
  if (!/^[\w.+-]+@gmail\.com$/i.test(email)) {
    return { status: 400, data: { message: "Chỉ hỗ trợ gửi OTP tới địa chỉ Gmail." } };
  }

  console.log('Email nhận được:', email);
  return await axios.post(`${API_URL}/auth/forgot-password`, { email }, { withCredentials: true });
};
// Gọi API verify otp
const verifyOtp = async (email, otp) => {
  return await axios.post(`${API_URL}/auth/verify-otp`, { email, otp }, { withCredentials: true });
};
// Gọi API reset password
const resetPassword = async (email, otp, newPassword) => {
  return await axios.post(`${API_URL}/auth/reset-password`, { email, otp, newPassword }, { withCredentials: true });
};

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Helper for OTP input
  const handleOtpChange = (value, idx) => {
    if (!/^[0-9]?$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[idx] = value;
    setOtp(newOtp);
    if (value && idx < 3) {
      document.getElementById(`otp-${idx + 1}`).focus();
    }
  };

  // Step 1: Nhập email
  const handleSendEmail = async (e) => {
    e.preventDefault();
    let err = {};
    // Loại bỏ dấu ngoặc kép và khoảng trắng thừa
    const cleanEmail = email.replace(/^"+|"+$/g, '').trim();
    if (!cleanEmail) err.email = 'Email không được để trống';
    else if (!/\S+@\S+\.\S+/.test(cleanEmail)) err.email = 'Email không hợp lệ';
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setLoading(true);
      try {
        const response = await forgotPassword(cleanEmail);
        if (response.status === 400) {
          setErrors({ email: response.data.message });
        } else {
          setStep(2);
        }
      } catch (error) {
        setErrors({ email: error.response?.data?.message || 'Không gửi được mã OTP' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Step 2: Nhập OTP
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    let err = {};
    if (otp.some((d) => d === '')) err.otp = 'Vui lòng nhập đầy đủ mã OTP';
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setLoading(true);
      try {
        await verifyOtp(email, otp.join(''));
        setStep(3);
      } catch (error) {
        setErrors({ otp: error.response?.data?.message || 'Mã OTP không đúng' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Step 3: Đặt lại mật khẩu
  const handleResetPassword = async (e) => {
    e.preventDefault();
    let err = {};
    if (!password) err.password = 'Mật khẩu không được để trống';
    else if (password.length < 6) err.password = 'Mật khẩu phải có ít nhất 6 ký tự';
    if (password !== confirmPassword) err.confirmPassword = 'Mật khẩu không khớp';
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setLoading(true);
      try {
        await resetPassword(email, otp.join(''), password);
        setStep(4);
        setSuccess(true);
      } catch (error) {
        setErrors({ confirmPassword: error.response?.data?.message || 'Không đặt lại được mật khẩu' });
      } finally {
        setLoading(false);
      }
    }
  };

  // Step 4: Quay lại đăng nhập
  const handleBackToLogin = () => {
    navigate('/login');
  };

  return (
    <div className="login-page">
      <header className="header">
        <Link to="/" className="logo-container">
          <img src={logo} alt="LazyNote Logo" className="logo" />
          <span className="logo-text">LazyNote</span>
        </Link>
      </header>
      <div className="login-container">
        <div className="login-card forgot-password-card">
          {step === 1 && (
            <>
              <h1>Quên mật khẩu</h1>
              <p>Đừng lo lắng! Đây là điều bình thường. Vui lòng nhập địa chỉ email liên kết với tài khoản của bạn.</p>
              <form onSubmit={handleSendEmail}>
                <div className="form-group">
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className={errors.email ? 'error' : ''}
                    placeholder="lazynote@gmail.com"
                  />
                  {errors.email && <span className="error-text">{errors.email}</span>}
                </div>
                <button type="submit" className="login-button forgot-btn" disabled={loading}>{loading ? 'Đang gửi...' : 'GỬI MÃ'}</button>
              </form>
            </>
          )}
          {step === 2 && (
            <>
              <h1>Xác minh OTP</h1>
              <p>Nhập mã xác nhận chúng tôi vừa gửi đến địa chỉ email của bạn.</p>
              <form onSubmit={handleVerifyOtp} className="forgot-otp-form">
                <div className="otp-input-group">
                  {[0,1,2,3,4,5].map(idx => (
                    <input
                      key={idx}
                      id={`otp-${idx}`}
                      type="text"
                      maxLength={1}
                      value={otp[idx]}
                      onChange={e => handleOtpChange(e.target.value, idx)}
                      className="otp-input"
                    />
                  ))}
                </div>
                {errors.otp && <span className="error-text">{errors.otp}</span>}
                <button type="submit" className="login-button forgot-btn" disabled={loading}>{loading ? 'Đang xác minh...' : 'NHẬP MÃ'}</button>
              </form>
            </>
          )}
          {step === 3 && (
            <>
              <h1>Tạo mật khẩu mới</h1>
              <p>Mật khẩu mới của bạn phải khác với những mật khẩu đã sử dụng trước đây.</p>
              <form onSubmit={handleResetPassword}>
                <div className="form-group">
                  <label htmlFor="password">Mật khẩu</label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className={errors.password ? 'error' : ''}
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
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className={errors.confirmPassword ? 'error' : ''}
                    placeholder="********"
                  />
                  {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}
                </div>
                <button type="submit" className="login-button forgot-btn" disabled={loading}>{loading ? 'Đang đặt lại...' : 'ĐẶT LẠI MẬT KHẨU'}</button>
              </form>
            </>
          )}
          {step === 4 && success && (
            <div className="forgot-success">
              <div className="forgot-success-icon">
                <svg width="64" height="64" viewBox="0 0 24 24" fill="none"><path d="M20 7L10.5 17L4 10.5" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <h2>Mật khẩu đã được thay đổi!</h2>
              <p className="forgot-success-desc">Mật khẩu của bạn đã được cập nhật thành công.</p>
              <button className="login-button forgot-btn" onClick={handleBackToLogin}>QUAY LẠI ĐĂNG NHẬP</button>
            </div>
          )}
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

export default ForgotPassword;
