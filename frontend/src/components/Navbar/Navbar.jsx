// frontend/src/components/Navbar.js

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import { getUserProfile } from '../../services/api';
import UserProfileDropdown from '../UserProfileDropdown/UserProfileDropdown';
import { FaPlaneDeparture, FaAddressBook, FaHome, FaInfoCircle } from 'react-icons/fa'; 
import { BiLogIn } from 'react-icons/bi';
import { GiHamburgerMenu } from 'react-icons/gi';
import { AiOutlineClose } from 'react-icons/ai';
import './Navbar.css';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem('token');

  const gitHubUrl = "https://github.com/kuryudesu"; 
  const [user, setUser] = useState(null);

  const handleLinkClick = () => {
    // 點擊任何連結或 Logo 後，關閉行動版選單
    if (isMobileMenuOpen) {
      setIsMobileMenuOpen(false);
    }
  }

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
              // 如果 API 失敗 (例如 token 過期)，嘗試從 localStorage 載入
              const storedUser = localStorage.getItem('user');
              if (storedUser) {
                  const parsedUser = JSON.parse(storedUser);
                  setUser(parsedUser);
              }
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
    // 當 isMobileMenuOpen 狀態改變時，切換 body 上的 class
    if (isMobileMenuOpen) {
      document.body.classList.add('mobile-menu-open');
    } else {
      document.body.classList.remove('mobile-menu-open');
    }

    // 組件卸載時，清理 class，避免 bug
    return () => {
      document.body.classList.remove('mobile-menu-open');
    };
  }, [isMobileMenuOpen]);

  // 將導航連結渲染為一個獨立的 JSX 變數，方便重用
  const renderDesktopLinks = (
    <>
      {isLoggedIn ? (
        <>
          <Link to="/" className="nav-link" onClick={handleLinkClick}>
            <FaHome /> Home
          </Link>
          <Link to="/info" className="nav-link" onClick={handleLinkClick}>
            <FaInfoCircle /> Info
          </Link>          
          <a href={gitHubUrl} target="_blank" rel="noopener noreferrer" className="nav-link">
            <FaAddressBook /> Contact
          </a>
          <UserProfileDropdown onLinkClick={handleLinkClick} />
        </>
      ) : (
        <>
          <Link to="/" className="nav-link" onClick={handleLinkClick}>
            <FaHome /> Home
          </Link>
          <Link to="/info" className="nav-link" onClick={handleLinkClick}>
            <FaInfoCircle /> Info
          </Link>           
          <a href={gitHubUrl} target="_blank" rel="noopener noreferrer" className="nav-link">
              <FaAddressBook /> Contact
          </a>
          <Link to="/login" className="nav-link" onClick={handleLinkClick}>
            <BiLogIn /> Login
          </Link>
        </>
      )}
    </>
  );

  const renderMobileLinks = (
    <>
      {isLoggedIn ? (
          <>
            {user ? (
            <>
              <p className="welcome-text">HI!</p>
              <p className="username">{user.email}</p>
            </>
              ) : (
              <p className="welcome-text">Welcome!</p>
            )}
            <Link to="/" className="nav-link" onClick={handleLinkClick}>
              <FaHome /> Home
            </Link>
            <Link to="/info" className="nav-link" onClick={handleLinkClick}>
              <FaInfoCircle /> Info
            </Link>             
            <a href={gitHubUrl} target="_blank" rel="noopener noreferrer" className="nav-link">
              <FaAddressBook /> Contact
            </a>
            <UserProfileDropdown onLinkClick={handleLinkClick} />
          </>
      ) : (
        <>
          <Link to="/" className="nav-link" onClick={handleLinkClick}>
            <FaHome /> Home
          </Link>
          <Link to="/info" className="nav-link" onClick={handleLinkClick}>
            <FaInfoCircle /> Info
          </Link>           
          <a href={gitHubUrl} target="_blank" rel="noopener noreferrer" className="nav-link">
            <FaAddressBook /> Contact
          </a>      
          <Link to="/login" className="nav-link" onClick={handleLinkClick}>
            <BiLogIn /> Login
          </Link>
        </>
        )}
      </>
    );
  
  return (
    <>
      <nav className="navbar">
        <Link to="/" className="navbar-brand" onClick={handleLinkClick}>
          <FaPlaneDeparture />
          <span>TravelJet</span>
        </Link>
        
        <div className="navbar-links desktop-links">
          {renderDesktopLinks}
        </div>
        
        <button className="hamburger-menu" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <AiOutlineClose /> : <GiHamburgerMenu />}
        </button>
      </nav>

      {isMobileMenuOpen && (
        <>
          <div className="mobile-menu-overlay" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="mobile-menu">
            {renderMobileLinks}
          </div>
        </>
      )}
    </>
  );
};

export default Navbar;
