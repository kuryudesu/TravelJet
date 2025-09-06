// import React, { useState } from 'react';
import React, { useState, useEffect } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { FaTachometerAlt, FaUser, FaPlaneDeparture, FaQuestionCircle, FaSignOutAlt, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import '../../styles/DashboardPage.css';

const DashboardPage = () => {
    const navigate = useNavigate();
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, []);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };    

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user'); // 確保同時移除用戶資訊
        alert('You have been logged out.');
        navigate('/');
        window.location.reload();
    };

    return (
        <div className={`dashboard-container ${isCollapsed ? 'sidebar-collapsed' : 'dashboard-sidebar:hover'}`}>
            <aside className="dashboard-sidebar">
                <button className="sidebar-toggle" onClick={toggleSidebar}>
                    {isCollapsed ? <FaChevronRight /> : <FaChevronLeft />}
                </button>
                <div className="sidebar-nav">
                    <div className="sidebar-header">
                        <h3>Dashboard</h3>
                    </div>
                    <nav>
                        <ul>
                            <li>
                                <NavLink to={user ? `/${user.username}/dashboard` : "/dashboard"} end className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                                    <FaTachometerAlt />
                                    <span>Overview</span>
                                </NavLink>
                            </li>
                            <li>
                                {/* <NavLink to="/dashboard/profile" className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}> */}
                                <NavLink to={user ? `/${user.username}/dashboard/profile` : "/dashboard/profile"} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                                    <FaUser />
                                    <span>My Profile</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={user ? `/${user.username}/dashboard/bookings` : "/dashboard/bookings"} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                                    <FaPlaneDeparture />
                                    <span>My Bookings</span>
                                </NavLink>
                            </li>
                            <li>
                                <NavLink to={user ? `/${user.username}/dashboard/support` : "/dashboard/support"} className={({ isActive }) => "nav-link" + (isActive ? " active" : "")}>
                                    <FaQuestionCircle />
                                    <span>Support</span>
                                </NavLink>
                            </li>
                        </ul>
                    </nav>
                </div>
                <div className="sidebar-footer">
                    <button onClick={handleLogout} className="logout-button">
                        <FaSignOutAlt />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
            <main className="dashboard-content">
                <Outlet />
            </main>
        </div>
    );
};

export default DashboardPage;
