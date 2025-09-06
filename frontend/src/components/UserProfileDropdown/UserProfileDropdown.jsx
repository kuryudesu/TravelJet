// frontend/src/components/UserProfileDropdown.js
import { React, useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getUserProfile } from '../../services/api';
import { FaUserCircle, FaTachometerAlt } from 'react-icons/fa';
import { BiDetail, BiLogOut, BiUser } from 'react-icons/bi';
import './UserProfileDropdown.css';

const UserProfileDropdown = ({ onLinkClick }) => {
    const [isOpen, setIsOpen] = useState(false);
    
    //  1. 新增一個 state 來儲存用戶資訊
    const [user, setUser] = useState(null);

    const dropdownRef = useRef(null);
    const navigate = useNavigate();
    
    //  2. 在組件掛載時，從 localStorage 獲取用戶資訊
    // useEffect(() => {
    //     const storedUser = localStorage.getItem('user');
    //     if (storedUser) {
    //         setUser(JSON.parse(storedUser));
    //     }
    // }, []); // 空依賴項陣列確保只在首次渲染時執行

    useEffect(() => {
        const loadUser = async () => {
            // 1. 先判斷是否存在 token
            const token = localStorage.getItem('token');
            if (!token) {
                // 如果沒有 token，直接返回，不執行任何操作
                console.log("No token found, user is not logged in.");
                return;
            }

            // 2. 如果有 token，嘗試從 API 獲取用戶資訊
            try {
                const { data } = await getUserProfile();
                setUser(data);
                // 為了保持同步，用最新的數據更新 localStorage
                localStorage.setItem('user', JSON.stringify(data));
            } catch (error) {
                console.error("Failed to fetch user profile, token might be invalid.", error);
                // 如果 token 無效導致 API 失敗，執行登出清理
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                navigate('/login');
            }
        };

        loadUser();
    }, [navigate]); // 空依賴項陣列，確保只在組件首次掛載時執行一次  

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // 確保同時移除用戶資訊
        setIsOpen(false);
        alert('You have been logged out.');
        navigate('/');
        window.location.reload();
    };

    const handleLinkClick = () => {
        setIsOpen(false);
        if (onLinkClick) {
            onLinkClick();
        }
    };

    const displayAvatar = () => {
    const backendUrl = 'YOUR_BACKEND_URL_HERE' || 'http://localhost:5000'; // 確保這個 URL 正確
        
        // 如果 user 存在且有 avatar_url，就顯示圖片
        if (user?.avatar_url) {
            return (
                <img 
                    src={`${backendUrl}${user.avatar_url}?_=${new Date().getTime()}`} 
                    alt={user.username || 'User Avatar'} 
                    className="avatar-image" // 使用一個新的 class
                />
            );
        }
        
        // 否則，顯示預設的圖示
        return <FaUserCircle />;
    };

    return (
        <div className="profile-dropdown-container" ref={dropdownRef}>
            <button className="profile-avatar-button" onClick={() => setIsOpen(!isOpen)}>
                {displayAvatar()}
            </button>

            {isOpen && (
                <div className="dropdown-menu">
                    {/*  3. 更新 dropdown-header 的內容 */}
                    <div className="dropdown-header">
                        {/* 只有當 user 存在時才顯示 */}
                        {user ? (
                            <>
                                <p className="welcome-text">Welcome back,</p>
                                <p className="username"><BiUser />{user.username}</p>
                            </>
                        ) : (
                            <p className="welcome-text">Welcome!</p>
                        )}
                    </div>
                    <ul>
                        <li>
                            <Link to={user ? `/${user.username}/dashboard/bookings` : "/dashboard/bookings"} onClick={handleLinkClick}>
                                <BiDetail /> My Bookings
                            </Link>
                        </li>
                        <li>
                            <Link to={user ? `/${user.username}/dashboard` : "/dashboard"} onClick={handleLinkClick}>
                                <FaTachometerAlt /> Dashboard
                            </Link>
                        </li>
                        <li className="dropdown-divider"></li>
                        <li>
                            <button onClick={handleLogout} className="logout-btn">
                                <BiLogOut /> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );
};

export default UserProfileDropdown;