// frontend/src/pages/LoginPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login } from '../../services/api';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 
import '../../styles/Form.css'; // 引入通用表單樣式

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        avatar_url: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const { data } = await login(formData);
            localStorage.setItem('token', data.token); // 儲存 token
            localStorage.setItem('user', JSON.stringify(data.user)); // (可選) 儲存使用者資訊
            
            navigate('/'); // 導向到主頁
            window.location.reload(); // 重新載入以更新 Navbar

        } catch (err) {
            setError(err.response?.data?.message || 'Login failed. Please check your credentials.');
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    return (
        <div className="form-page-container">
            <div className="form-container">
                <h1>Login</h1>
                {error && <div className="error-message">{error}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <div className="form-group password-input-container">
                        <label htmlFor="password">Password</label>
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                        {formData.password.length > 0 &&(
                            <button
                                type="button"
                                className="password-toggle-icon"
                                onClick={togglePasswordVisibility}
                            >
                                {isPasswordVisible ? <AiFillEyeInvisible /> : <AiFillEye />}
                            </button>
                        )}
                    </div>
                    <button type="submit" className="submit-button" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="switch-form-link">
                    <p>
                        Don't have an account? <Link to="/register">Register here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;