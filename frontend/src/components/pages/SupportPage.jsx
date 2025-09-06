// frontend/src/pages/SupportPage.js

import React, { useState } from 'react';
import { FaChevronDown, FaEnvelope, FaPhone } from 'react-icons/fa';
import { MdOutlineContactSupport } from 'react-icons/md';
import '../../styles/SupportPage.css';

// FAQ 數據可以獨立出來，方便未來管理
const faqData = [
    {
        question: "How do I book a flight?",
        answer: "Simply use the search form on our homepage to find flights. Select your desired flight from the results, and click 'Book Now'. You must be logged in to complete a booking."
    },
    {
        question: "How can I view my bookings?",
        answer: "If you are logged in, you can view all your past and current bookings by navigating to the 'My Bookings' page from the navigation bar."
    },
    {
        question: "How do I cancel a booking?",
        answer: "On the 'My Bookings' page, each confirmed booking has a 'Cancel Booking' button. Please note that cancellation policies may vary."
    }
];

// 單個 FAQ 項目的組件
const FaqItem = ({ faq, index, activeIndex, setActiveIndex }) => {
    const isActive = index === activeIndex;

    const toggleAccordion = () => {
        setActiveIndex(isActive ? null : index);
    };

    return (
        <div className="faq-item">
            <button className={`faq-question ${isActive ? 'active' : ''}`} onClick={toggleAccordion}>
                {faq.question}
                <FaChevronDown className="faq-icon" />
            </button>
            <div className="faq-answer">
                <p>{faq.answer}</p>
            </div>
        </div>
    );
};


const SupportPage = () => {
    const [activeIndex, setActiveIndex] = useState(null); // 控制哪個 FAQ 是打開的

    return (
        <div className="support-page">
            <div className="support-header">
                <h1>Travel Support</h1>
                <p>We're here to help. Find answers to common questions below.</p>
            </div>

            <div className="support-content">
                <div className="faq-section">
                    <h2><MdOutlineContactSupport />FAQ</h2>
                    <div className="faq-list">
                        {faqData.map((faq, index) => (
                            <FaqItem
                                key={index}
                                index={index}
                                faq={faq}
                                activeIndex={activeIndex}
                                setActiveIndex={setActiveIndex}
                            />
                        ))}
                    </div>
                </div>

                <div className="contact-section">
                    <h2>Still Need Help?</h2>
                    <p>If you can't find the answer you're looking for, feel free to contact us directly.</p>
                    <div className="contact-card">
                        <div className="contact-method">
                            <FaEnvelope className="contact-icon" />
                            <div>
                                <h4>Email Us</h4>
                                <a href="mailto:support@traveljet.dev">support@traveljet.dev</a>
                            </div>
                        </div>
                        <div className="contact-method">
                            <FaPhone className="contact-icon" />
                            <div>
                                <h4>Call Us (Mon-Fri, 9am-5pm)</h4>
                                <span>+886 (XX) XXXX-XXXX</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SupportPage;