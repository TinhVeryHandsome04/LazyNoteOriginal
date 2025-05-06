import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logoutUser } from '../redux/authSlice';

const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="navbar-container">
      {isAuthenticated && (
        <div className="navbar-menu">
          <Link to="/dashboard" className="nav-link">
            Bảng điều khiển
          </Link>
          <Link to="/expenses" className="nav-link">
            Chi tiêu
          </Link>
          <Link to="/reports" className="nav-link">
            Báo cáo
          </Link>
          
          {/* User Dropdown */}
          <div className="user-dropdown">
            <span className="user-name" onClick={toggleMenu} aria-haspopup="true" aria-expanded={isMenuOpen}>
              {user.name}
            </span>
            {isMenuOpen && (
              <div className="dropdown-menu">
                <Link to="/profile" className="dropdown-item">
                  Hồ sơ
                </Link>
                <Link to="/settings" className="dropdown-item">
                  Cài đặt
                </Link>
                <Link to="/login" className="dropdown-item" onClick={handleLogout}>
                  Đăng xuất
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
