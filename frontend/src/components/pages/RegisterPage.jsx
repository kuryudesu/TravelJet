// frontend/src/pages/RegisterPage.js

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/api';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; 
import '../../styles/Form.css';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            await register(formData);
            setSuccess('Registration successful! Redirecting to login...');
            setTimeout(() => {
                navigate('/login');
            }, 2000); // 2秒後跳轉

        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };
    
    // 建立一個成功訊息的樣式
    const successMessageStyle = {
      backgroundColor: '#d1e7dd',
      color: '#0f5132',
      border: '1px solid #badbcc',
      padding: '15px',
      borderRadius: '6px',
      textAlign: 'center',
      marginBottom: '20px',
    };

    const togglePasswordVisibility = () => {
        setIsPasswordVisible(!isPasswordVisible);
    }

    return (
        <div className="form-page-container">
            <div className="form-container">
                <h1>Register</h1>
                {error && <div className="error-message">{error}</div>}
                {success && <div style={successMessageStyle}>{success}</div>}
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </div>
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
                            minLength="6"
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
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                </form>
                <div className="switch-form-link">
                    <p>
                        Already have an account? <Link to="/login">Login here</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;