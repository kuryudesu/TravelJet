// frontend/src/pages/MyProfilePage.js

import React, { useState, useEffect, useRef } from 'react'; // <-- 導入 useRef
import { getUserProfile, updateUserProfile, uploadAvatar } from '../../services/api';
import { FaUserCircle, FaCamera } from 'react-icons/fa'; // <-- 導入 FaCamera
import Spinner from '../Spinner/Spinner';
import '../../styles/MyProfilePage.css'; // 引入新 CSS

const MyProfilePage = () => {
    const [user, setUser] = useState(null);
    const [infoData, setInfoData] = useState({ username: '', email: '' });
    const [passwordData, setPasswordData] = useState({ newPassword: '', confirmPassword: '' });

    const [loading, setLoading] = useState(true);
    const [infoMessage, setInfoMessage] = useState({ type: '', text: '' });
    const [avatarMessage, setAvatarMessage] = useState({ type: '', text: '' });
    const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

    const [avatarFile, setAvatarFile] = useState(null); // <-- 新增: 儲存選擇的檔案
    const [avatarPreview, setAvatarPreview] = useState(null); // <-- 新增: 儲存預覽圖片的 URL

    const fileInputRef = useRef(null); // <-- 新增: 用於觸發檔案選擇器
    
    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                // 優先從 API 獲取最新數據
                const { data } = await getUserProfile();
                setUser(data);
                setInfoData({ username: data.username, email: data.email });
            } catch (error) {
                console.error("API failed, falling back to localStorage", error);
                // 如果 API 失敗 (例如 token 過期)，嘗試從 localStorage 載入
                const storedUser = localStorage.getItem('user');
                if (storedUser) {
                    const parsedUser = JSON.parse(storedUser);
                    setUser(parsedUser);
                    setInfoData({ username: parsedUser.username, email: parsedUser.email });
                }
            } finally {
                setLoading(false);
            }
        };

        loadUserProfile();
    }, []); // 空依賴項陣列確保只在首次渲染時執行

    const handleInfoChange = (e) => setInfoData({...infoData, [e.target.name]: e.target.value });
    const handlePasswordChange = (e) => setPasswordData({...passwordData, [e.target.name]: e.target.value });

    const handleInfoSubmit = async (e) => {
        e.preventDefault();
        setLoading(true); setInfoMessage({ type: '', text: ''});
        try {
            const { data } = await updateUserProfile(infoData);
            setUser(data.user); // 更新顯示的 user 資訊
            localStorage.setItem('user', JSON.stringify(data.user)); // 更新 localStorage
            setInfoMessage({ type: 'success', text: data.message });
            setTimeout(() => {
                setInfoMessage('');
            }, 1000);
        } catch (error) {
            setInfoMessage({ type: 'error', text: error.response?.data?.message || "Update failed." });
            setTimeout(() => {
                setInfoMessage('');
            }, 1000);
        } finally {
            setLoading(false);
        }
    };
    
    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if(passwordData.newPassword !== passwordData.confirmPassword) {
            setPasswordMessage({ type: 'error', text: "Passwords do not match." });
            return;
        }
        setLoading(true); setPasswordMessage({ type: '', text: ''});
        try {
            const { data } = await updateUserProfile({ password: passwordData.newPassword });
            setPasswordMessage({ type: 'success', text: data.message });
            setPasswordData({ newPassword: '', confirmPassword: '' }); // 清空欄位
            setTimeout(() => {
                setPasswordMessage('');
            }, 1000);
            
        } catch (error) {
            setPasswordMessage({ type: 'error', text: error.response?.data?.message || "Password update failed." });
            setTimeout(() => {
                setPasswordMessage('');
            }, 1000);
        } finally {
            setLoading(false);
        }
    };

    // --- 新增: 處理檔案選擇和預覽的函式 ---
    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            // 建立本地預覽 URL
            const previewUrl = URL.createObjectURL(file);
            setAvatarPreview(previewUrl);
        }
    };

    // --- 新增: 處理頭像上傳的函式 ---
    const handleAvatarUpload = async () => {
        if (!avatarFile) return;
        
        const formData = new FormData();
        formData.append('avatar', avatarFile);
        
        setLoading(true);
        try {
            const { data } = await uploadAvatar(formData);
            
            // 上傳成功後，更新 user state 和 localStorage
            const updatedUser = { ...user, avatar_url: data.avatarUrl };
            setUser(updatedUser);
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setAvatarPreview(null); // 清除預覽
            setAvatarMessage({ type: 'success', text: 'Avatar updated!' });
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        } catch (error) {
            setAvatarMessage({ type: 'error', text: error.response?.data?.message || 'Upload failed.'});
        } finally {
            setLoading(false);
        }
    };

    if (loading && !user) return <Spinner />;
    // 決定顯示哪個頭像: 預覽 > 已有頭像 > 預設圖示
    const displayAvatar = () => {
        const backendUrl = `http://192.168.0.170:5000`; // 後端 URL
        if (avatarPreview) {
            return <img src={avatarPreview} alt="Preview" className="profile-avatar-large"/>;
        }
        if (user && user.avatar_url) {
            const imgUrl = `${backendUrl}${user.avatar_url}?_=${new Date().getTime()}`;
            return <img src={imgUrl} alt={user.username} className="profile-avatar-large"/>;
        }
        
        return <FaUserCircle className="profile-avatar-large"/>;
    };
    
    return (
        <div className="profile-page">
            {/*  更新 Header  */}
            <header className="profile-header">
                {/* 點擊頭像區域可以觸發檔案選擇 */}
                <div className="avatar-uploader" onClick={() => fileInputRef.current.click()}>
                    {displayAvatar()}
                    <div className="avatar-overlay">
                        <FaCamera />
                        <span>Change</span>
                    </div>
                </div>
                {/* 隱藏的檔案輸入框 */}
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleAvatarChange}
                    style={{ display: 'none' }} 
                    accept="image/*" // 只接受圖片檔案
                />
                {avatarMessage.text && <p className={`avatar-message ${avatarMessage.type}`}>{avatarMessage.text}</p>}
                <div className="profile-header-info">
                    <h1>{user?.username}</h1>
                    <p>{user?.email}</p>
                    {/* 如果有預覽圖片，顯示上傳按鈕 */}
                    {avatarPreview && (
                         <button onClick={handleAvatarUpload} className="submit-button small-btn" disabled={loading}>
                            {loading ? 'Uploading...' : 'Upload Avatar'}
                        </button>
                    )}
                </div>
            </header>
            <main className="profile-content">
                {/* --- Personal Information Card --- */}
                <div className="profile-card">
                    <h2>Personal Information</h2>
                    <form onSubmit={handleInfoSubmit}>
                        <div className="form-group">
                            <label htmlFor="username">Username</label>
                            <input type="text" id="username" name="username" value={infoData.username} onChange={handleInfoChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="email">Email Address</label>
                            <input type="email" id="email" name="email" value={infoData.email} onChange={handleInfoChange} />
                        </div>
                        <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                        {infoMessage.text && <p className={`message ${infoMessage.type}`}>{infoMessage.text}</p>}
                    </form>
                </div>

                {/* --- Password Security Card --- */}
                <div className="profile-card">
                    <h2>Password & Security</h2>
                    <form onSubmit={handlePasswordSubmit}>
                        <div className="form-group">
                            <label htmlFor="newPassword">New Password</label>
                            <input type="password" id="newPassword" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} />
                        </div>
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirm New Password</label>
                            <input type="password" id="confirmPassword" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} />
                        </div>
                         <button type="submit" className="submit-button" disabled={loading}>
                            {loading ? 'Updating...' : 'Update Password'}
                        </button>
                         {passwordMessage.text && <p className={`message ${passwordMessage.type}`}>{passwordMessage.text}</p>}
                    </form>
                </div>
            </main>
        </div>
    );
};

export default MyProfilePage;