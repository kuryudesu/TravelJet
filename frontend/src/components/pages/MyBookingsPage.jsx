// frontend/src/pages/MyBookingsPage.js

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMyBookings, cancelBooking } from '../../services/api';
import { FaPlane } from 'react-icons/fa';
import Spinner from '../../components/Spinner/Spinner'; // 重用 Spinner
import '../../styles/MyBookingsPage.css';

const MyBookingsPage = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Helper function to format date for better readability
    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-CA', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
        });
    };

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const { data } = await getMyBookings();
                // Sort bookings to show upcoming ones first, then by status
                const sortedData = data.sort((a, b) => {
                    if (a.status === b.status) {
                        return new Date(b.flight_details.flight_date) - new Date(a.flight_details.flight_date);
                    }
                    return a.status === 'confirmed' ? -1 : 1;
                });
                setBookings(sortedData);
            } catch (err) {
                setError('Failed to fetch your bookings. You might need to log in again.');
                if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                    setTimeout(() => navigate('/login'), 2000);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchBookings();
    }, [navigate]);

    const handleCancelBooking = async (bookingId) => {
        if (!window.confirm("Are you sure you want to cancel this booking?")) {
            return; // Don't navigate, just stop the function
        }
            
        try {
            await cancelBooking(bookingId);
                
            // Update UI: Mark the booking as 'cancelled'
            setBookings(prevBookings => 
                prevBookings.map(booking =>
                    booking.id === bookingId ? { ...booking, status: 'cancelled' } : booking
                )
            );
            alert('Booking cancelled successfully.');

        } catch (err) {
            alert(err.response?.data?.message || 'Failed to cancel the booking.');
        }
    };

    if (loading) {
        return <Spinner />;
    }

    if (error) {
        return <div className="bookings-error">{error}</div>;
    }

    return (
        <div className="bookings-page">
            <h1>My Bookings</h1>
            {bookings.length > 0 ? (
                <div className="bookings-list">
                    {bookings.map(booking => (                        
                        <div key={booking.id} className={`booking-card ${booking.status}`}>
                            <div className="booking-header">
                                <div className="flight-info">
                                    <h3>
                                        {booking.flight_details.departure_iata}
                                        <FaPlane />
                                        {booking.flight_details.arrival_iata}
                                    </h3>
                                </div>
                                <span className={`status-badge ${booking.status}`}>
                                    {booking.status}
                                </span>
                            </div>
                            <div className="booking-details">
                                <p>{booking.flight_details.departure} to {booking.flight_details.arrival}</p>
                                <p><strong>Airline:</strong> {booking.flight_details.airline}</p>
                                <p><strong>Flight Number:</strong> {booking.flight_details.flight_number}</p>
                                <p><strong>Flight Date:</strong> {formatDate(booking.flight_details.flight_date)}</p>
                                <p><strong>Flight Time:</strong> {booking.flight_details.departure_time} - {booking.flight_details.arrival_time}</p>
                                <p><strong>Booking Date:</strong> {new Date(booking.booking_date).toLocaleString()}</p>
                            </div>
                            {booking.status === 'confirmed' && (
                                <div className="booking-actions">
                                    <button
                                        className="cancel-button"
                                        onClick={() => handleCancelBooking(booking.id)}
                                    >
                                        Cancel
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="no-bookings">                    
                    <p>You have no bookings yet.</p>
                    <Link to="/" className="book-now-button">Book a Flight Now</Link>
                </div>
            )}
        </div>
    );
};

export default MyBookingsPage;