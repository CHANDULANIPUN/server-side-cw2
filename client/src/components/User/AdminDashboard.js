import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
    const navigate = useNavigate();

    // Inline styles
    const containerStyle = {
        textAlign: 'center',
        padding: '50px 20px',
        backgroundColor: '#f0f0f0',
        minHeight: '100vh',
        fontFamily: 'Roboto, sans-serif', // Use Roboto font
    };

    const buttonStyle = {
        padding: '10px 20px',
        margin: '10px',
        backgroundColor: '#0d0d0d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#666666',
    };

    const textStyle = {
        padding: '20px',
        fontSize: '1.2em',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ fontSize: '3em', color: '#333', marginBottom: '20px' }}>Admin Dashboard</h1>
            <p style={textStyle}>
                Welcome to the Admin Dashboard! Here you can manage users and view reports.
            </p>
            <button
                style={buttonStyle}
                onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                onClick={() => navigate('/api-key-manager')} // Example navigation
            >
                User Management
            </button>
        </div>
    );
};

export default AdminDashboard;