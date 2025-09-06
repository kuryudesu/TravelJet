// frontend/src/components/FlightCard.js
import React from 'react';
import './FlightCard.css';

const FlightCard = ({ flight, onBook }) => {
  // 格式化日期和時間以便顯示
  console.log("Fetched data from flight:", flight); // 打印整個陣列
  console.log("Total flight fetched:", flight.length); // 打印陣列長度
  const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="flight-container">
      <div className="flight-card">
        <div className="airline-info">
          <span className="airline-name">{flight.airline.name}</span>
          <span className="flight-number">{flight.flight.iata}</span>
        </div>
        <div className="route-info">
          <div className="airport">
            <span className="iata-code">{flight.departure.iata}</span>
            <span className="flight-day">{new Date(flight.flight_date).toLocaleDateString()}</span>
            <span className="time">{formatTime(flight.departure.scheduled)}</span>
            <span className="airport-name">{flight.departure.airport}</span>
          </div>
          <div className="route-line">✈</div>
          <div className="airport">
            <span className="iata-code">{flight.arrival.iata}</span>
            <span className="flight-day">{new Date(flight.flight_date).toLocaleDateString()}</span>
            <span className="time">{formatTime(flight.arrival.scheduled)}</span>
            <span className="airport-name">{flight.arrival.airport}</span>
          </div>
        </div>
        <div className="booking-action">
          <button className="book-button" onClick={() => onBook(flight)}>
            Book Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlightCard;