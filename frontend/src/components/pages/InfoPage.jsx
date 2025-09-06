import React from 'react';
import '../../styles/InfoPage.css';

const InfoPage = () => {
  return (
    <div className="info-page-container">
      <h1>Info</h1>
      <p>Welcome to our travel booking platform! We are committed to providing you with the easiest flight enquiry and booking experience.</p>
      
      <section className="info-section">
        <h2>Our mission</h2> 
        <p>Our mission is to make travel easier and more affordable. Whether you're traveling for business or pleasure, we can help you find the perfect flight.</p>
      </section>
      
      <section className="info-section">
        <h2>Why Choose Us?</h2>
        <ul>
            <li>Global route coverage</li>
            <li>24/7 customer support</li>
            <li>User-friendly interface</li>
        </ul>
      </section>
      
      <section className="info-section">
        <h2>Contact us</h2>
        <p>If you have any questions or need assistance, please feel free to reach out to us at our <a href="/support">support page</a>. </p>
      </section>
    </div>
  );
};

export default InfoPage;
