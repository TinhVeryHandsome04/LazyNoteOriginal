import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaWallet, FaFolderOpen, FaLightbulb } from "react-icons/fa";
import { HiBell } from "react-icons/hi";
import { HiMiniCog6Tooth } from "react-icons/hi2";
import { MdWindow, MdAnalytics } from "react-icons/md";
import { IoLogOut } from "react-icons/io5";
import { BsPersonCircle } from "react-icons/bs";
import Overlay from 'react-bootstrap/Overlay';
import Tooltip from 'react-bootstrap/Tooltip';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import "./../style/Sidebar.css";
import logo from "../images/logo.jpg";
import 'bootstrap/dist/css/bootstrap.min.css';
import { useSelector, useDispatch } from "react-redux";
import avatarDefault from "../images/avatar.png";

// Import logout action
let logoutUser = null;
try {
    logoutUser = require('../redux/authSlice').logoutUser;
} catch (error) {
    // Không cần log lỗi
}

// Dữ liệu mẫu 
const sampleUserData = {
    username: 'lazynote',
    name: 'Lazy Note',
    email: 'lazynote@example.com',
    phoneNumber: '+84123456789',
    role: 'user',
    image: avatarDefault
};

const menuItems = [
    {
        to: "/dashboard",
        label: "Tổng quan",
        icon: <MdWindow className="icon" />
    },
    {
        to: "/quan-ly-thu-chi",
        label: "Quản lý thu chi",
        icon: <FaWallet className="icon" />
    },
    {
        to: "/phan-tich-tai-chinh",
        label: "Phân tích tài chính",
        icon: <MdAnalytics className="icon" />
    },
    {
        to: "/goi-y-chi-tieu",
        label: "Gợi ý chi tiêu",
        icon: <FaLightbulb className="icon" />
    },
    {
        to: "/danh-muc-thu-chi",
        label: "Danh mục thu chi",
        icon: <FaFolderOpen className="icon" />
    },
    {
        to: "/thong-bao",
        label: "Thông báo",
        icon: <HiBell className="icon" />
    },
    {
        to: "/usersettings",
        label: "Bảo mật & Cài đặt",
        icon: <HiMiniCog6Tooth className="icon" />
    },
];

const Sidebar = () => {
    const [collapsed, setCollapsed] = useState(window.innerWidth <= 900);
    const [hoveredIdx, setHoveredIdx] = useState(null);
    const iconRefs = useRef([]);
    const user = useSelector((state) => state.auth?.user);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth > 900 && collapsed) {
                setCollapsed(false);
            }
        };
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, [collapsed]);

    // Xử lý logout
    const handleLogout = () => setShowLogoutModal(true);
    const cancelLogout = () => setShowLogoutModal(false);

    const confirmLogout = () => {
        setShowLogoutModal(false);
        localStorage.removeItem('token');
        localStorage.removeItem('user');

        if (logoutUser && dispatch) {
            try {
                dispatch(logoutUser())
                    .then(() => navigate('/login', { replace: true }))
                    .catch(() => navigate('/login', { replace: true }));
            } catch (error) {
                navigate('/login', { replace: true });
            }
        } else {
            navigate('/login', { replace: true });
        }
    };

    // Lấy dữ liệu người dùng
    const storedUser = (() => {
        try {
            const localStorageUser = localStorage.getItem('user');
            return user || (localStorageUser ? JSON.parse(localStorageUser) : null) || sampleUserData;
        } catch (error) {
            return sampleUserData;
        }
    })();

    // Xử lý ảnh đại diện
    const userAvatar = storedUser?.image || sampleUserData.image;

    const getAvatarUrl = (avatarPath) => {
        if (!avatarPath) return avatarDefault;
        if (avatarPath.startsWith('data:') || avatarPath.startsWith('http') || avatarPath.startsWith('https')) {
            return avatarPath;
        }
        if (avatarPath.startsWith('/')) {
            return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${avatarPath}`;
        }
        return avatarDefault;
    };

    // Lấy tên hiển thị
    const userName = (() => {
        if (storedUser?.name) {
            const nameParts = storedUser.name.split(' ');
            if (nameParts.length > 0) {
                return nameParts[nameParts.length - 1];
            }
        }
        return storedUser?.username ||
            (storedUser?.email ? storedUser.email.split('@')[0] : sampleUserData.username);
    })();

    return (
        <div className={`sidebar${collapsed ? " collapsed" : ""}`}>
            <div
                className="sidebar-header"
                onClick={() => setCollapsed((prev) => !prev)}
            >
                <img src={logo} alt="Logo" className="s-logo" />
                {!collapsed && <span className="sidebar-logotext">LazyNote</span>}
            </div>
            <div className="sidebar-menu">
                {menuItems.map((item, idx) => (
                    <div
                        key={item.to}
                        ref={el => iconRefs.current[idx] = el}
                        onMouseEnter={() => setHoveredIdx(idx)}
                        onMouseLeave={() => setHoveredIdx(null)}
                        style={{ position: 'relative' }}
                    >
                        <NavLink
                            to={item.to}
                            className={({ isActive }) =>
                                isActive ? "sidebar-link active" : "sidebar-link"
                            }
                        >
                            {item.icon}
                            {!collapsed && <span className="sidebar-label">{item.label}</span>}
                        </NavLink>
                        {collapsed && (
                            <Overlay target={iconRefs.current[idx]} show={hoveredIdx === idx} placement="right">
                                {(props) => (
                                    <Tooltip id={`sidebar-tooltip-${idx}`} {...props} className="custom-tooltip">
                                        {item.label}
                                    </Tooltip>
                                )}
                            </Overlay>
                        )}
                    </div>
                ))}
            </div>
            <div className="sidebar-footer">
                <div className="user-info">
                    <img
                        src={getAvatarUrl(userAvatar)}
                        alt="avatar"
                        onError={(e) => {
                            e.target.src = avatarDefault;
                        }}
                    />
                    {!collapsed && <span className="sidebar-username">{userName}</span>}
                </div>
                <button className="logout-btn" onClick={handleLogout}>
                    <IoLogOut className="icon" size={24} />
                </button>
            </div>
            <Modal show={showLogoutModal} onHide={cancelLogout} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận đăng xuất</Modal.Title>
                </Modal.Header>
                <Modal.Body>Bạn có muốn đăng xuất không?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={cancelLogout}>
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={confirmLogout}>
                        Đăng xuất
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
}
export default Sidebar;