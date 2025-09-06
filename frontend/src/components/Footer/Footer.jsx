// frontend/src/components/Footer.js

import React from 'react';
import { Link } from 'react-router-dom';
import { 
    FaGithub, 
    FaPlaneDeparture, 
    FaAddressBook, 
    FaLink
} from 'react-icons/fa';
import { BiDetail, BiLogIn } from 'react-icons/bi';
import { MdOutlineContactSupport } from 'react-icons/md';
import './Footer.css';

const Footer = () => {
  // 檢查登入狀態，邏輯正確
  const isLoggedIn = !!localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user'));

  // GitHub URL，邏輯正確
  const gitHubUrl = "https://github.com/kuryudesu"; 

  

  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        {/* Section 1: Logo and Description (這部分在兩種狀態下都一樣) */}
        <div className="footer-section">
          <h3 className="footer-logo">TravelJet</h3>
          <p>Your ultimate partner in discovering and booking flights worldwide.</p>
        </div>

        {/* Section 2: Quick Links (這是主要簡化的地方) */}
        <div className="footer-section">
          <h4><FaLink /> Quick Links</h4>
          <ul className="footer-links">
            <li><Link to="/"><FaPlaneDeparture /> Search Flights</Link></li>
            <li><Link to="/support"><MdOutlineContactSupport />Support</Link></li>
            <li><Link to={user ? `/${user.username}/dashboard/bookings` : "/dashboard/bookings"}><BiDetail /> My Bookings</Link></li>
            {/* 關鍵：使用條件渲染只顯示 "Login" 連結 */}
            {!isLoggedIn && (
              <li><Link to="/login"><BiLogIn /> Login</Link></li>
            )}
          </ul>
        </div>
        
        {/* Section 3: Connect (這部分在兩種狀態下也一樣) */}
        <div className="footer-section">
          <h4><FaAddressBook /> Connect</h4>
          <div className="social-links">
            <a href={gitHubUrl} target="_blank" rel="noopener noreferrer" className="social-icon">
              <FaGithub />
              <span>GitHub</span>
            </a>
          </div>
        </div>

      </div>
      
      {/* Footer Bottom (這部分也一樣) */}
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} TravelJet. Developed with ❤.</p>
      </div>
    </footer>
  );
};

export default Footer;