// frontend/src/pages/HomePage.js

import React, { useState, useEffect } from 'react';
import { FaPlaneDeparture, FaPlaneArrival, FaCalendarAlt, FaExchangeAlt } from 'react-icons/fa';
import { searchFlights, createBooking } from '../../services/api';
import video from '../../assets/video.mp4';
import areoplane from '../../assets/takeOff.png'
import FlightCard from '../FlightCard/FlightCard';
import Spinner from '../Spinner/Spinner';
import AirportAutocomplete from '../AirportAutocomplete/AirportAutocomplete';
import SupportPage from './SupportPage';
import AOS from 'aos';
import 'aos/dist/aos.css';
import '../../styles/HomePageV2.css'; // <-- 引入新的 CSS
const HomePage = () => {
    // --- State Management ---
    const [tripType, setTripType] = useState('round-trip');
    const [searchParams, setSearchParams] = useState({
        departure_iata: '',
        arrival_iata: '',
        departure_date: '',
        return_date: '',
    });
    // Existing states for data fetching
    const [airports, setAirports] = useState([]);
    const [flights, setFlights] = useState(null);
    const [isLoading, setIsLoading] = useState({ airports: true, flights: false });
    const [error, setError] = useState({ airports: '', flights: '' });

    // useEffect 獲取機場數據的部分是正確的，保持不變
    useEffect(() => {
        const fetchAirports = async () => {
            const cachedAirports = localStorage.getItem('airportsData');
            if (cachedAirports) {
                setAirports(JSON.parse(cachedAirports));
                setIsLoading(prev => ({ ...prev, airports: false }));
                return;
            }
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/airports_clean.json`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();

                setAirports(data);
                localStorage.setItem('airportsData', JSON.stringify(data));
            } catch (err) {
                console.error("Failed to fetch airports.json:", err);
                setError(prev => ({ ...prev, airports: 'Could not load airports data.' }));
            } finally {
                setIsLoading(prev => ({ ...prev, airports: false }));
            }
        };
        fetchAirports();
    }, []);

    useEffect(() => {
        AOS.init({
            duration: 500, // 動畫持續時間
            once: false,     // 動畫是否只執行一次
            mirror: false,
        });
    }, []);

    // --- Event Handlers ---
    const handleAirportSelect = (field, iata) => setSearchParams(p => ({...p, [field]: iata}));
    const handleDateChange = (e) => setSearchParams(p => ({...p, [e.target.name]: e.target.value}));
    
    const swapAirports = () => {
        setSearchParams(p => ({ ...p, departure_iata: p.arrival_iata, arrival_iata: p.departure_iata }));
    };
    
    const handleSearch = async (e) => {
        e.preventDefault();
        setIsLoading(p => ({...p, flights: true})); setError(p=>({...p, flights: ''})); setFlights(null);
        
        // 準備要傳送給後端的參數
        const apiParams = {
            departure_iata: searchParams.departure_iata,
            arrival_iata: searchParams.arrival_iata,
            flight_date: searchParams.departure_date,
        };

        try {
            const { data } = await searchFlights(apiParams);
            setFlights(data.data || []);
            console.log("Flights fetched successfully:", data);
        } catch (err) {
            setError(p => ({...p, flights: err.response?.data?.message || 'Search failed.'}));
        } finally {
            setIsLoading(p => ({...p, flights: false}));
        }
    };
    
    // handleBookFlight 函式保持不變
    const handleBookFlight = async (flight) => {
        if (!window.confirm("Are you sure you want to book this flight?")) return;
        const formatTime = (dateString) => new Date(dateString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        const flightDetails = {
            flight_date: flight.flight_date,
            airline: flight.airline.name,
            flight_number: flight.flight.iata,
            departure: flight.departure.airport,
            arrival: flight.arrival.airport,
            departure_iata: flight.departure.iata,
            arrival_iata: flight.arrival.iata,
            departure_time: formatTime(flight.departure.scheduled),
            arrival_time: formatTime(flight.arrival.scheduled),
        };
        
        try {
            await createBooking({ flightDetails });
            alert("Flight booked successfully!");
        } catch(err) {
            alert(err.response?.data?.message || "Failed to book flight.");
        }
    }

    // 抽出一個函式來渲染結果，讓程式碼更乾淨
    const renderResults = () => {
        if (isLoading.flights) {
            return <div className="spinner-container"><Spinner /></div>;
        }

        if (error.flights) {
            return <p style={{ color: 'red', textAlign: 'center' }}>{error.flights}</p>;
        }
        
        if (flights === null) {
            return <p style={{ textAlign: 'center', color: '#666' }}></p>;
        }

        if (flights.length === 0) {
            return <p style={{ textAlign: 'center', color: '#666' }}>No flights found for your search criteria.</p>;
        }

        return flights.map((flight, index) => (
            <FlightCard
                key={`${flight.flight.iata}-${index}`}
                flight={flight}
                onBook={handleBookFlight}
            />
        ));
    };

    // --- FIX 4: 更新 JSX 以使用 AirportAutocomplete 和正確的 State ---
    return (
          <div className="homepage">
            <header className="hero-section" data-aos="fade-down">
              <h1>Your Journey Begins Here</h1>
              <p>Discover and book flights to your dream destinations</p>
            </header>
            <div className="homeImages flex" data-aos="fade-up">
                <div className="videoDiv">
                    <video src={video} autoPlay muted loop className='video' fetchPriority="high"></video>
                </div>
                <img src={areoplane} alt="" className='plane' fetchPriority="low"/>
            </div>            
            <div className="new-homepage-container" data-aos="fade-up" data-aos-delay="200">
                <div className="search-widget-card">
                    <div className="trip-type-tabs">
                        <button className={tripType === 'round-trip' ? 'active' : ''} onClick={() => setTripType('round-trip')}>Round-trip</button>
                        <button className={tripType === 'one-way' ? 'active' : ''} onClick={() => setTripType('one-way')}>One-way</button>
                    </div>

                    <form onSubmit={handleSearch}>
                        <div className={`search-fields-grid ${tripType === 'one-way' ? 'one-way-trip' : ''}`}>
                            <div className="form-field">
                                <label><FaPlaneDeparture/> From</label>
                                <AirportAutocomplete airports={airports} value={searchParams.departure_iata} onSelect={(iata) => handleAirportSelect('departure_iata', iata)} placeholder="Departure"/>
                                <div className="swap-btn-container"><button type="button" className="swap-btn" onClick={swapAirports}><FaExchangeAlt/></button></div>
                            </div>
                            <div className="form-field">
                                <label><FaPlaneArrival/> To</label>
                                <AirportAutocomplete airports={airports} value={searchParams.arrival_iata} onSelect={(iata) => handleAirportSelect('arrival_iata', iata)} placeholder="Arrival"/>
                            </div>
                            <div className="form-field">
                                <label><FaCalendarAlt/> Departure</label>
                                <input type="date" name="departure_date" value={searchParams.departure_date} onChange={handleDateChange} required/>
                            </div>
                            {tripType === 'round-trip' && (
                                <div className="form-field return-date-field">
                                    <label><FaCalendarAlt/>Return</label>
                                    <input type="date" name="return_date" value={searchParams.return_date} onChange={handleDateChange} required={tripType === 'round-trip'}/>
                                </div>
                            )}
                        </div>

                        <div className="search-button-wrapper">
                            <button type="submit" className="search-button-v2">Search Flights</button>
                        </div>
                    </form>
                </div>
            </div>

            <div className="results-section-v2" data-aos="fade-in">
              <section className="results-section">
                {renderResults()}
              </section>
            </div>

            <div data-aos="fade-up">
                <SupportPage className="support"/>
            </div>
          </div>
    );
};

export default HomePage;