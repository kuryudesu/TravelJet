import React, { useState, useEffect } from 'react';
import { Link,useNavigate } from 'react-router-dom';
import { FaPlane, FaUser, FaBook } from 'react-icons/fa';
import { FaArrowRightLong } from 'react-icons/fa6';
import { getBookingDetails, getBookingSummary } from '../../services/api';
import '../../styles/DashboardHomePage.css';
import Spinner from '../Spinner/Spinner';

const DashboardHomePage = () => {
    const [user, setUser] = useState(null);
    const [totalBookings, setTotalBookings] = useState(0);
    const [bookingDetails, setBookingDetails] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const [error, setError] = useState('');

    useEffect(() => {
        const loadUser = async () => { 
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

    //     useEffect(() => {
    //     const loadUser = async () => {
    //         // 1. 先判斷是否存在 token
    //         const token = localStorage.getItem('token');
    //         if (!token) {
    //             // 如果沒有 token，直接返回，不執行任何操作
    //             console.log("No token found, user is not logged in.");
    //             return;
    //         }

    //         // 2. 如果有 token，嘗試從 API 獲取用戶資訊
    //         try {
    //             const { data } = await getUserProfile();
    //             setUser(data);
    //             // 為了保持同步，用最新的數據更新 localStorage
    //             localStorage.setItem('user', JSON.stringify(data));
    //         } catch (error) {
    //             console.error("Failed to fetch user profile, token might be invalid.", error);
    //             // 如果 token 無效導致 API 失敗，執行登出清理
    //             localStorage.removeItem('token');
    //             localStorage.removeItem('user');
    //             navigate('/login');
    //         }
    //     };

    //     loadUser();
    // }, [navigate]); // 空依賴項陣列，確保只在組件首次掛載時執行一次  

    useEffect(() => {
        const fetchBookingData = async () => {
            setIsLoading(true);
            try {
                const [detailsResponse, summaryResponse] = await Promise.all([
                    getBookingDetails(),
                    getBookingSummary(),
                ]);
                setBookingDetails(detailsResponse.data);
                setTotalBookings(summaryResponse.data);

            } catch (err) {
                setError('Failed to fetch your booking data.');
            } finally {
                setIsLoading(false);
            }
        };
        fetchBookingData();

    }, []);

    if (isLoading) {
        return <div className="spinner-container"><Spinner /></div>;
    }

    if (error) {
        return <div className="bookings-error">{error}</div>;
    }

    const token = localStorage.getItem('token');
    if (!user || !token) {
        return (
            <div className="dashboard-home">
                <div className="welcome-banner">
                    <h2>Welcome!</h2>
                    <p>Please <Link to="/login">log in</Link> to see your dashboard.</p>
                </div>
            </div>
        );
    }

    const upcomingBooking = bookingDetails.length > 0 ? bookingDetails[0] : null;

    return (
        <div className="dashboard-home">
            <div className="welcome-banner">
                <h2>Welcome back, {user.username}!</h2>
                <p>Here's a quick overview of your account.</p>
            </div>
            <div className="dashboard-stats">
                <Link to={user ? `/${user.username}/dashboard/bookings` : '/dashboard/bookings'} className="stat-card">
                    <FaPlane className="stat-icon" />
                    <div className="stat-info">
                        <h4>Upcoming Trip</h4>
                        <p>{upcomingBooking ? <>{upcomingBooking.flight_details.departure_iata} <FaArrowRightLong /> {upcomingBooking.flight_details.arrival_iata}</> : 'None'}</p>
                    </div>
                </Link>
                <Link to={user ? `/${user.username}/dashboard/bookings` : '/dashboard/bookings'} className="stat-card">
                    <FaBook className="stat-icon" />
                    <div className="stat-info">
                        <h4>Total Bookings</h4>
                        <p>{totalBookings}</p>
                    </div>
                </Link>
                {/* <Link to="/dashboard/profile" className="stat-card"> */}
                <Link to={user ? `/${user.username}/dashboard/profile` : '/dashboard/profile'} className="stat-card">
                    <FaUser className="stat-icon" />
                    <div className="stat-info">
                        <h4>My Profile</h4>
                        <p>View & Edit</p>
                    </div>
                </Link>
            </div>
            <div className="upcoming-trip-section">
                <h3>Your Next Adventure</h3>
                {upcomingBooking ? (
                    <div className="upcoming-trip-card">
                        <div className="trip-header">
                            <span>{upcomingBooking.flight_details.airline} {upcomingBooking.flight_details.flight_number}</span>
                            <span>{new Date(upcomingBooking.flight_details.flight_date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        <div className="trip-body">
                            <div className="location"><p className="airport-code">{upcomingBooking.flight_details.departure_iata}</p><p className="airport-name">{upcomingBooking.flight_details.departure}</p><span className="time">{upcomingBooking.flight_details.departure_time}</span></div>
                            <div className="flight-path"><FaPlane /></div>
                            <div className="location"><p className="airport-code">{upcomingBooking.flight_details.arrival_iata}</p><p className="airport-name">{upcomingBooking.flight_details.arrival}</p><span className="time">{upcomingBooking.flight_details.arrival_time}</span></div>
                        </div>
                        <div className="trip-footer"><Link to={user ? `/${user.username}/dashboard/bookings` : '/dashboard/bookings'} className="details-button">View All</Link></div>
                    </div>
                ) : (
                    <div className="no-upcoming-trip">
                        <p>You have no upcoming trips. Time to plan a new one!</p>
                        <Link to="/" className="book-now-button">Book a Flight</Link>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DashboardHomePage;
