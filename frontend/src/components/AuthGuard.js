import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { checkAuth } from '../redux/authSlice';
import Sidebar from './Sidebar';

const AuthGuard = ({ children }) => {
    const { isAuthenticated } = useSelector((state) => state.auth);
    const token = localStorage.getItem('token');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [checking, setChecking] = useState(true);
    const [authChecked, setAuthChecked] = useState(false);

    useEffect(() => {
        // Tránh kiểm tra nhiều lần
        if (authChecked) return;

        // Nếu đang đăng xuất, redirect trước khi render
        if (!token) {
            navigate('/login', { replace: true });
            setChecking(false);
            setAuthChecked(true);
            return;
        }

        if (token && !isAuthenticated) {
            // Nếu có token nhưng chưa xác thực trong Redux, kiểm tra với server
            setChecking(true);
            dispatch(checkAuth())
                .unwrap()
                .catch(() => {
                    // Nếu không xác thực được, xóa token và chuyển về login
                    localStorage.removeItem('token');
                    navigate('/login', { replace: true });
                })
                .finally(() => {
                    setChecking(false);
                    setAuthChecked(true);
                });
        } else {
            setChecking(false);
            setAuthChecked(true);
        }
    }, [dispatch, isAuthenticated, navigate, token, authChecked]);


    // Nếu có token và đã xác thực, render children với Sidebar
    return (
        <div className="dashboard-layout">
            <Sidebar />
            <div className="main-content">
                {children}
            </div>
        </div>
    );
};

export default AuthGuard; 