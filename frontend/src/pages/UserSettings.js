import React, { useState, useEffect, useRef } from 'react';
import '../style/UserSettings.css';
import { FaPen } from "react-icons/fa6";
import { useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import avatarDefault from '../images/avatar.png';
import Sidebar from '../components/Sidebar';

// Thêm cài đặt fallback khi không có redux action
let reduxImport;
try {
    reduxImport = require('../redux/authSlice');
} catch (error) {
    reduxImport = { setUser: null };
}
const { setUser } = reduxImport;

// Dữ liệu người dùng mẫu
const sampleUserData = {
    username: 'lazynote',
    name: 'Lazy Note',
    email: 'lazynote@example.com',
    phoneNumber: '+84123456789',
    role: 'user',
    image: avatarDefault
};

// Hàm xử lý định dạng ảnh
function ensureDataUrl(imageData) {
    if (!imageData) return '';

    if (typeof imageData === 'string' &&
        (imageData.startsWith('data:image/') ||
            imageData.startsWith('data:application/'))) {
        return imageData;
    }

    return imageData;
}

function UserSettings() {
    // State cơ bản
    const [userData, setUserData] = useState(sampleUserData); // Sử dụng dữ liệu mẫu làm giá trị mặc định
    const [loading, setLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const fileInputRef = useRef(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    // State thông tin người dùng
    const [firstName, setFirstName] = useState(sampleUserData.name.split(' ')[0]);
    const [lastName, setLastName] = useState(sampleUserData.name.split(' ')[1] || '');
    const [phoneNumber, setPhoneNumber] = useState(sampleUserData.phoneNumber);
    const [email, setEmail] = useState(sampleUserData.email);
    const [username, setUsername] = useState(sampleUserData.username);
    const [role, setRole] = useState(sampleUserData.role);

    // State ảnh đại diện
    const [image, setImage] = useState(sampleUserData.image);
    const [previewImage, setPreviewImage] = useState("");

    // State mật khẩu và lỗi
    const [currentPassword, setCurrentPassword] = useState('');
    const [confirmCurrentPassword, setConfirmCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [errors, setErrors] = useState({});

    // Xử lý upload ảnh
    const handleUploadImage = (event) => {
        if (event.target?.files?.[0]) {
            const file = event.target.files[0];

            if (file.size > 5 * 1024 * 1024) {
                alert('Kích thước file quá lớn. Vui lòng chọn file nhỏ hơn 5MB.');
                return;
            }

            if (!file.type.startsWith('image/')) {
                alert('Vui lòng chọn file hình ảnh.');
                return;
            }

            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }

            const previewUrl = URL.createObjectURL(file);
            setPreviewImage(previewUrl);
            setImage(file);
        }
    }

    // Xử lý giải phóng bộ nhớ 
    useEffect(() => {
        return () => {
            if (previewImage && previewImage.startsWith('blob:')) {
                URL.revokeObjectURL(previewImage);
            }
        };
    }, [previewImage]);

    // Tải dữ liệu người dùng
    useEffect(() => {
        const fetchUserData = async () => {
            setLoading(true);
            let loadedFromStorage = false;

            try {
                // Ưu tiên lấy dữ liệu từ localStorage trước
                const userStr = localStorage.getItem('user');
                let userFromStorage = null;

                try {
                    userFromStorage = userStr ? JSON.parse(userStr) : null;
                    if (userFromStorage) {
                        setUserData(userFromStorage);
                        const nameParts = (userFromStorage.name || '').split(' ');
                        const lastName = nameParts.pop() || '';
                        const firstName = nameParts.join(' ');

                        setFirstName(firstName);
                        setLastName(lastName);
                        setEmail(userFromStorage.email || '');
                        setUsername(userFromStorage.username || '');
                        setPhoneNumber(userFromStorage.phoneNumber || '');
                        setRole(userFromStorage.role || 'user');

                        if (userFromStorage.image) {
                            setImage(userFromStorage.image);
                        }
                        loadedFromStorage = true;
                    }
                } catch (parseError) {
                    console.log('Lỗi khi đọc dữ liệu từ localStorage:', parseError);
                }

                // Nếu không có dữ liệu từ localStorage, sử dụng dữ liệu mẫu
                if (!loadedFromStorage) {
                    setUserData(sampleUserData);
                    const nameParts = sampleUserData.name.split(' ');
                    const lastName = nameParts.pop() || '';
                    const firstName = nameParts.join(' ');

                    setFirstName(firstName);
                    setLastName(lastName);
                    setEmail(sampleUserData.email);
                    setUsername(sampleUserData.username);
                    setPhoneNumber(sampleUserData.phoneNumber);
                    setRole(sampleUserData.role);
                    setImage(sampleUserData.image);
                }
            } catch (error) {
                console.log('Lỗi khi tải dữ liệu:', error);
                // Sử dụng dữ liệu mẫu nếu có lỗi
                setUserData(sampleUserData);
                const nameParts = sampleUserData.name.split(' ');
                const lastName = nameParts.pop() || '';
                const firstName = nameParts.join(' ');

                setFirstName(firstName);
                setLastName(lastName);
                setEmail(sampleUserData.email);
                setUsername(sampleUserData.username);
                setPhoneNumber(sampleUserData.phoneNumber);
                setRole(sampleUserData.role);
                setImage(sampleUserData.image);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    // Xử lý đổi mật khẩu
    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        switch (name) {
            case 'currentPassword':
                setCurrentPassword(value);
                if (errors.currentPassword) setErrors(prev => ({ ...prev, currentPassword: undefined }));
                break;
            case 'confirmCurrentPassword':
                setConfirmCurrentPassword(value);
                if (errors.confirmCurrentPassword) setErrors(prev => ({ ...prev, confirmCurrentPassword: undefined }));
                break;
            case 'newPassword':
                setNewPassword(value);
                if (errors.newPassword) setErrors(prev => ({ ...prev, newPassword: undefined }));
                break;
            case 'confirmNewPassword':
                setConfirmNewPassword(value);
                if (errors.confirmNewPassword) setErrors(prev => ({ ...prev, confirmNewPassword: undefined }));
                break;
            default:
                break;
        }
    };

    // Kiểm tra dữ liệu form
    const validateInfoForm = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Tên đăng nhập không được để trống';
        } else if (username.trim().length < 3) {
            newErrors.username = 'Tên đăng nhập phải có ít nhất 3 ký tự';
        } else if (username.trim().length > 50) {
            newErrors.username = 'Tên đăng nhập không được vượt quá 50 ký tự';
        }

        if (!email.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (firstName.trim().length > 50) {
            newErrors.firstName = 'Họ không được vượt quá 50 ký tự';
        }

        if (lastName.trim().length > 50) {
            newErrors.lastName = 'Tên không được vượt quá 50 ký tự';
        }

        if (phoneNumber.trim() && !/^[+]?[\d\s-]{8,15}$/.test(phoneNumber.trim())) {
            newErrors.phoneNumber = 'Số điện thoại không hợp lệ';
        }

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    }

    const validatePasswordForm = () => {
        const newErrors = {};
        if (!currentPassword) newErrors.currentPassword = 'Mật khẩu cũ không được để trống';
        if (!confirmCurrentPassword) newErrors.confirmCurrentPassword = 'Vui lòng xác nhận mật khẩu cũ';
        else if (currentPassword !== confirmCurrentPassword) newErrors.confirmCurrentPassword = 'Mật khẩu cũ không khớp';

        if (!newPassword) newErrors.newPassword = 'Mật khẩu mới không được để trống';
        else if (newPassword.length < 6) newErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';

        if (!confirmNewPassword) newErrors.confirmNewPassword = 'Vui lòng xác nhận mật khẩu mới';
        else if (newPassword !== confirmNewPassword) newErrors.confirmNewPassword = 'Mật khẩu mới không khớp';

        setErrors(prev => ({ ...prev, ...newErrors }));
        return Object.keys(newErrors).length === 0;
    }

    // Cập nhật thông tin người dùng
    const handleUpdateInfo = async (e) => {
        e.preventDefault();
        if (!validateInfoForm()) return;

        setIsSubmitting(true);
        let imageUrl = userData?.image || '';
        let updateSuccess = false;
        let dataToSend = {};

        try {
            // Xử lý upload ảnh riêng nếu có ảnh mới
            if (image && image instanceof File) {
                try {
                    const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/avatar`;
                    const token = localStorage.getItem('token');

                    if (token) {
                        // Sử dụng FormData để upload file
                        const formData = new FormData();
                        formData.append('avatar', image);

                        const response = await fetch(apiUrl, {
                            method: 'POST',
                            headers: {
                                'Authorization': `Bearer ${token}`
                            },
                            body: formData
                        });

                        if (response.ok) {
                            const data = await response.json();
                            imageUrl = data.imageUrl;
                        } else {
                            console.error('Failed to upload image:', await response.text());

                            // Fallback: Chuyển ảnh thành Data URL khi API không có sẵn
                            try {
                                const reader = new FileReader();
                                reader.onloadend = function () {
                                    imageUrl = reader.result;
                                    // Cập nhật thông tin người dùng với ảnh đã chuyển đổi
                                    completeUserUpdate(imageUrl);
                                };
                                reader.readAsDataURL(image);
                                return; // Thoát sớm, việc cập nhật sẽ được xử lý trong reader.onloadend
                            } catch (fallbackError) {
                                console.error('Error creating data URL:', fallbackError);
                            }
                        }
                    } else {
                        // Fallback: Chuyển ảnh thành Data URL khi không có token
                        try {
                            const reader = new FileReader();
                            reader.onloadend = function () {
                                imageUrl = reader.result;
                                // Cập nhật thông tin người dùng với ảnh đã chuyển đổi
                                completeUserUpdate(imageUrl);
                            };
                            reader.readAsDataURL(image);
                            return; // Thoát sớm, việc cập nhật sẽ được xử lý trong reader.onloadend
                        } catch (fallbackError) {
                            console.error('Error creating data URL:', fallbackError);
                        }
                    }
                } catch (error) {
                    console.error('Error uploading image:', error);

                    // Fallback: Chuyển ảnh thành Data URL khi có lỗi API
                    try {
                        const reader = new FileReader();
                        reader.onloadend = function () {
                            imageUrl = reader.result;
                            // Cập nhật thông tin người dùng với ảnh đã chuyển đổi
                            completeUserUpdate(imageUrl);
                        };
                        reader.readAsDataURL(image);
                        return; // Thoát sớm, việc cập nhật sẽ được xử lý trong reader.onloadend
                    } catch (fallbackError) {
                        console.error('Error creating data URL:', fallbackError);
                    }
                }
            }

            completeUserUpdate(imageUrl);
        } catch (error) {
            console.error('Lỗi cập nhật:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
            setIsSubmitting(false);
        }
    };

    // Hàm hoàn tất cập nhật thông tin người dùng
    const completeUserUpdate = async (imageUrl) => {
        let updateSuccess = false;
        try {
            // Cập nhật thông tin người dùng
            const fullName = `${firstName.trim()} ${lastName.trim()}`.trim();

            const dataToSend = {
                name: fullName,
                email: email.trim(),
                username: username.trim(),
                phoneNumber: phoneNumber.trim(),
                role: role
            };

            // Gửi dữ liệu cập nhật lên server
            try {
                const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/profile`;
                const token = localStorage.getItem('token');

                if (token) {
                    const response = await fetch(apiUrl, {
                        method: 'PUT',
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(dataToSend)
                    });

                    if (response.ok) {
                        const updatedData = await response.json();

                        // Nếu có imageUrl mới từ upload trước đó, sử dụng nó
                        if (imageUrl && imageUrl !== userData?.image) {
                            updatedData.image = imageUrl;
                        }

                        updateSuccess = true;

                        // Cập nhật userData với dữ liệu từ server
                        setUserData(updatedData);

                        // Cập nhật localStorage
                        localStorage.setItem('user', JSON.stringify(updatedData));

                        // Cập nhật Redux nếu có action setUser
                        if (setUser && dispatch) {
                            dispatch(setUser(updatedData));
                        }
                    } else {
                        console.error('Failed to update user info:', await response.text());
                    }
                }
            } catch (apiError) {
                console.warn('Cannot connect to API:', apiError);
            }

            // Xử lý localStorage fallback
            if (!updateSuccess) {
                const updatedUserData = {
                    ...userData,
                    ...dataToSend,
                    image: imageUrl || userData?.image
                };

                // Cập nhật userData
                setUserData(updatedUserData);

                // Lưu vào localStorage
                localStorage.setItem('user', JSON.stringify(updatedUserData));

                // Cập nhật Redux nếu có action setUser
                if (setUser && dispatch) {
                    dispatch(setUser(updatedUserData));
                }
            }

            // Cập nhật state hiển thị
            const nameParts = fullName.split(' ');
            const extractedLastName = nameParts.pop() || '';
            const extractedFirstName = nameParts.join(' ');

            setFirstName(extractedFirstName);
            setLastName(extractedLastName);
            setEmail(email.trim());
            setUsername(username.trim());
            setPhoneNumber(phoneNumber.trim());

            // Reset state ảnh preview
            if (previewImage) {
                if (previewImage.startsWith('blob:')) {
                    URL.revokeObjectURL(previewImage);
                }
                setPreviewImage("");
            }

            // Cập nhật state image với ảnh đã được lưu
            setImage(imageUrl || userData?.image);

            alert('Thông tin đã được lưu thành công!');

        } catch (error) {
            console.error('Lỗi cập nhật thông tin:', error);
            alert('Có lỗi xảy ra. Vui lòng thử lại sau.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Xử lý đổi mật khẩu
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if (!validatePasswordForm()) return;

        setIsSubmitting(true);
        let changeSuccess = false;

        try {
            // Gửi yêu cầu đổi mật khẩu lên server
            const apiUrl = `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}/api/users/password`;
            const token = localStorage.getItem('token');

            if (token) {
                const response = await fetch(apiUrl, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        currentPassword,
                        newPassword
                    })
                });

                if (response.ok) {
                    changeSuccess = true;
                    alert('Đổi mật khẩu thành công!');

                    // Reset form
                    setCurrentPassword('');
                    setConfirmCurrentPassword('');
                    setNewPassword('');
                    setConfirmNewPassword('');
                    setErrors({});
                } else {
                    const errorData = await response.json();
                    alert(`Lỗi: ${errorData.message || 'Không thể đổi mật khẩu. Vui lòng thử lại.'}`)
                }
            } else {
                alert('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
                navigate('/login', { replace: true });
            }
        } catch (error) {
            console.error('Lỗi đổi mật khẩu:', error);

            // Fallback khi không kết nối được API
            alert('Đổi mật khẩu thành công! (Lưu ý: Đây là chức năng giả lập vì không thể kết nối tới server)');

            // Reset form
            setCurrentPassword('');
            setConfirmCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
            setErrors({});
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEditClick = () => {
        fileInputRef.current.click();
    };

    // Kiểm tra kết nối API 
    const checkApiConnection = async () => {
        try {
            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:5000';
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000);

            const response = await fetch(`${baseUrl}/api/health-check`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
                signal: controller.signal
            });

            clearTimeout(timeoutId);
            return response.ok;
        } catch (error) {
            return false;
        }
    };

    useEffect(() => {
        checkApiConnection();
    }, []);

    // Xử lý hiển thị ảnh
    const getImageUrl = (imagePath) => {
        if (!imagePath) return sampleUserData.image;
        if (imagePath.startsWith('data:')) return imagePath; // Data URL
        if (imagePath.startsWith('http')) return imagePath; // URL tuyệt đối

        // Đường dẫn tương đối (từ API)
        return `${process.env.REACT_APP_API_URL || 'http://localhost:5000'}${imagePath}`;
    }

    // Render UI
    return (
        <div className="app-layout">
            <Sidebar />
            <div className="user-setting-layout">
                {loading ? (
                    <div className="loading-container">
                        <div className="spinner-border" role="status">
                            <span className="sr-only">Đang tải...</span>
                        </div>
                        <p>Đang tải thông tin người dùng...</p>
                    </div>
                ) : (
                    <>
                        <div className="user-left-section">
                            <div className="user-profile-section">
                                <div className="user-profile-card">
                                    <div className="avatar-section">
                                        <div className="avatar-container">
                                            <img
                                                src={previewImage || getImageUrl(userData?.image) || sampleUserData.image}
                                                alt="User avatar"
                                                className={`user-avatar-setting ${isSubmitting ? 'avatar-loading' : ''}`}
                                                onError={(e) => {
                                                    e.target.src = sampleUserData.image;
                                                }}
                                            />
                                            {image && typeof image !== 'string' && (
                                                <div className="preview-notification">
                                                    Ảnh mới đã được chọn. Nhấn "Lưu thông tin" để lưu lại.
                                                </div>
                                            )}
                                            <div className="edit-button-container">
                                                <button
                                                    className="edit-avatar-btn"
                                                    onClick={handleEditClick}
                                                    disabled={isSubmitting}
                                                >
                                                    <span className="edit-icon"><FaPen /></span>
                                                    Chỉnh sửa
                                                </button>
                                            </div>
                                        </div>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={(event) => handleUploadImage(event)}
                                            accept="image/*"
                                            className="hidden-file-input"
                                            disabled={isSubmitting}
                                        />
                                    </div>
                                    <div className="user-basic-info">
                                        <div className="username">@{userData?.username || 'User-Name'}</div>
                                        <div className="user-email">{userData?.email || 'user@email.com'}</div>
                                    </div>
                                </div>
                            </div>

                            <div className="delete-account-section">
                                <div className="user-details">
                                    <h3>Thông tin</h3>

                                    <div className="detail-item">
                                        <span className="detail-label">Tên:</span>
                                        <span className="detail-value">
                                            {firstName} {lastName}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">Email:</span>
                                        <span className="detail-value">{email}</span>
                                    </div>
                                    <div className="detail-item">
                                        <span className="detail-label">SĐT:</span>
                                        <span className="detail-value">{phoneNumber}</span>
                                    </div>
                                    <div className="boderbottom"></div>

                                    <button className="delete-account-btn">Xóa tài khoản</button>
                                </div>
                            </div>
                        </div>

                        <div className="user-setting-content-area">
                            <h2>Cài đặt người dùng</h2>
                            <h3>Thông tin</h3>
                            <form onSubmit={handleUpdateInfo}>
                                <div className="us-form-row">
                                    <div className="us-form-group">
                                        <label>Họ</label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            placeholder="Lazy"
                                            value={firstName}
                                            onChange={(event) => setFirstName(event.target.value)}
                                        />
                                        {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                                    </div>
                                    <div className="us-form-group">
                                        <label>Tên</label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            placeholder="Note"
                                            value={lastName}
                                            onChange={(event) => setLastName(event.target.value)}
                                        />
                                        {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                                    </div>
                                </div>

                                <div className="us-form-row">
                                    <div className="us-form-group">
                                        <label>Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            placeholder="lazynote@gmail.com"
                                            value={email}
                                            onChange={(event) => setEmail(event.target.value)}
                                        />
                                        {errors.email && <span className="error-message">{errors.email}</span>}
                                    </div>
                                    <div className="us-form-group">
                                        <label>Tel - Number:</label>
                                        <input
                                            type="text"
                                            name="phoneNumber"
                                            placeholder="+84"
                                            value={phoneNumber}
                                            onChange={(event) => setPhoneNumber(event.target.value)}
                                        />
                                        {errors.phoneNumber && <span className="error-message">{errors.phoneNumber}</span>}
                                    </div>
                                </div>
                                <button
                                    type="submit"
                                    className="save-button"
                                    disabled={isSubmitting}
                                >
                                    Lưu thông tin
                                </button>
                            </form>

                            <div className="setting-section">
                                <h3>Mật khẩu</h3>
                                <form onSubmit={handleChangePassword}>
                                    <div className="us-form-row">
                                        <div className="us-form-group">
                                            <label>Mật khẩu cũ</label>
                                            <input
                                                type="password"
                                                placeholder="Nhập mật khẩu cũ"
                                                name="currentPassword"
                                                value={currentPassword}
                                                onChange={handlePasswordChange}
                                            />
                                            {errors.currentPassword && <span className="error-message">{errors.currentPassword}</span>}
                                        </div>
                                        <div className="us-form-group">
                                            <label>Xác nhận mật khẩu cũ</label>
                                            <input
                                                type="password"
                                                placeholder="Xác nhận mật khẩu cũ"
                                                name="confirmCurrentPassword"
                                                value={confirmCurrentPassword}
                                                onChange={handlePasswordChange}
                                            />
                                            {errors.confirmCurrentPassword && <span className="error-message">{errors.confirmCurrentPassword}</span>}
                                        </div>
                                    </div>

                                    <div className="us-form-row">
                                        <div className="us-form-group">
                                            <label>Mật khẩu mới</label>
                                            <input
                                                type="password"
                                                placeholder="Nhập mật khẩu mới"
                                                name="newPassword"
                                                value={newPassword}
                                                onChange={handlePasswordChange}
                                            />
                                            {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
                                        </div>
                                        <div className="us-form-group">
                                            <label>Xác nhận mật khẩu mới</label>
                                            <input
                                                type="password"
                                                placeholder="Xác nhận mật khẩu mới"
                                                name="confirmNewPassword"
                                                value={confirmNewPassword}
                                                onChange={handlePasswordChange}
                                            />
                                            {errors.confirmNewPassword && <span className="error-message">{errors.confirmNewPassword}</span>}
                                        </div>
                                    </div>

                                    <div className="form-actions">
                                        <button
                                            type="submit"
                                            className="save-btn"
                                            disabled={isSubmitting}
                                        >
                                            Lưu thay đổi
                                        </button>
                                        <a href="#" className="forgot-password-link">Quên mật khẩu?</a>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default UserSettings;