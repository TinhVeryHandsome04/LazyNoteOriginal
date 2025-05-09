import React from "react";
import { Link } from "react-router-dom";
import logo from "../images/logo.jpg"; 
import h6 from "../images/image-1.png";
import h1 from "../images/1.png";
import h2 from "../images/2.png";
import h3 from "../images/3.png";
import h4 from "../images/4.png";
import h5 from "../images/5.png";

const HomePage = () => {
  return (
    <div className="homepage">
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src={logo} alt="LazyNote Logo" className="logo" />
          <span className="logo-text">LazyNote</span>
        </div>
        <div className="nav-links">
          <a href="/register" className="nav-link sign-up"><b>Đăng ký</b></a>
          <a href="/login" className="nav-link login"><b>Đăng nhập</b></a>
        </div>
      </header>

      {/* Hero Section */}
      <div className="hero">
        <div className="frame">
          <div className="title">
            Quản lý chi tiêu thông minh <br />
            Kiểm soát tài chính dễ dàng
          </div>
          <div className="sub-title">
            <span>
              <span className="sub-title-1">
                Bạn có lo lắng về chi tiêu hàng tháng? Hãy để
              </span>
              <span className="sub-title-2"> LAZYNOTE </span>
              <span className="sub-title-3">
                giúp bạn quản lý tài chính hiệu quả hơn!
              </span>
            </span>
          </div>
          <Link to="/register">
            <button className="register-btn">
              <div className="register-text">Đăng Ký</div>
            </button>
          </Link>
        </div>
        <div className="image-1">
          <img src={h6} alt="image-1"></img>
        </div>
      </div> {/* Đóng hero */}

      <div className="feature">
        <div className="feature-img">
          <img src={h1} alt="feature-1"></img>
          <img src={h2} alt="feature-2"></img>
          <img src={h3} alt="feature-3"></img>
          <img src={h4} alt="feature-4"></img>
          <img src={h5} alt="feature-5"></img>
        </div>
      </div>

      {/* Footer */}
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

export default HomePage;