import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleLearnClick = () => {
    navigate('/login');
  };

  // Inline styles
  const containerStyle = {
    textAlign: 'center',
    padding: '50px 20px',
    backgroundColor: '#f0f0f0',
    minHeight: '100vh',
    fontFamily: 'Roboto, sans-serif', // Use Roboto font
  };

  const headingStyle = {
    fontSize: '2.5em',
    color: '#333',
    marginBottom: '20px',
    lineHeight: '1.2', // Line height for spacing
  };

  const paragraphStyle = {
    fontSize: '1.2em',
    color: '#666',
    marginBottom: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    lineHeight: '1.6', // Line height for spacing
  };

  const buttonStyle = {
    padding: '10px 20px',
    marginTop: '20px',
    fontSize: '1em',
    color: '#fff',
    backgroundColor: '#0d0d0d',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease',
  };

  const buttonHoverStyle = {
    backgroundColor: '#737373',
   
  };

  return (
    <div style={containerStyle}>
      <h1 style={headingStyle}>Welcome to GlobalGlimpse App</h1>
      <p style={paragraphStyle}>
        Discover detailed information about countries around the world. Our app provides comprehensive data on geography, population, economy, and more.
      </p>
      <p style={paragraphStyle}>
        Whether you're a student, traveler, or just curious, our app offers easy access to essential country facts and figures. Stay informed with up-to-date information at your fingertips.
      </p>
      <p style={paragraphStyle}>
        Explore countries by region, compare statistics, and learn about cultural and historical highlights. Click the button below to start your journey of discovery.
      </p>
      <button
        onClick={handleLearnClick}
        style={buttonStyle}
        onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
        onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
      >
        Learn More
      </button>
    </div>
  );
};

export default HomePage;