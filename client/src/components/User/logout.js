// components/LogoutButton.js
import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LogoutButton = ({ setApiKey }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        const apiKey = localStorage.getItem('apiKey'); // ✅ Fix for no-undef
        try {
            await axios.post('http://localhost:5001/api/logout', { apiKey }); // ✅ Fix for unused response
            localStorage.removeItem('apiKey');
            setApiKey('');
            navigate('/');
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#f44336',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#d32f2f',
    };

    return (
        <button
            style={buttonStyle}
            onClick={handleLogout}
            onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
            onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
        >
            Logout
        </button>
    );
};

export default LogoutButton;
