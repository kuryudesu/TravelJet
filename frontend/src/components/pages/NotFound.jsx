import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles//NotFound.css';

const NotFound = () => {
  return (
    <>
      <title>404 - No page found</title>
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@400;700&family=Playfair+Display:wght@700&display=swap" rel="stylesheet" />
      <div className="notfound-container">
        <div className="notfound-content-box">
          <h1 className="notfound-status-code">404</h1>
          <h2 className="notfound-title">It looks like you're lost</h2>
          <p className="notfound-description">
            You seem to be on a path that isn't on the map.
          </p>
          <div className="notfound-actions">
            <Link to="/">Back to Home</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NotFound;

