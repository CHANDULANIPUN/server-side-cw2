import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    useEffect(() => {
        // Set the page title
        document.title = 'Register Page';
    }, []);

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/register', { username, password });
            setMessage(`User  registered successfully! API Key: ${response.data.apiKey}`);
        } catch (error) {
            setMessage('Registration failed: ' + error.response.data.error);
        }
    };

    // Inline styles
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start', // Align items to the top
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f2f2f2',
        padding: '40px 20px', // Add top padding to move content down
    };

    const formStyle = {
        maxWidth: '400px',
        width: '100%',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
    };

    const h1Style = {
        fontSize: '3em',
        color: '#333',
        marginBottom: '20px',
        marginTop: '30px',
        textAlign: 'center',
    };

    const paragraphStyle = {
        fontSize: '1.2em',
        color: '#555',
        marginBottom: '30px',
        maxWidth: '600px',
        margin: '0 auto',
        lineHeight: '1.6',
        paddingBottom: '30px',
        textAlign: 'center',
    
    };

    const h2Style = {
        textAlign: 'center',
        marginBottom: '20px',
        color: '#333',
    };

    const inputStyle = {
        width: 'calc(100% - 20px)',
        padding: '10px',
        marginBottom: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        boxSizing: 'border-box',
    };

    const buttonStyle = {
        width: '100%',
        padding: '10px',
        backgroundColor: '#0d0d0d',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease',
        marginBottom: '10px',
    };

    const buttonHoverStyle = {
        backgroundColor: '#595959',
    };

    const messageStyle = {
        textAlign: 'center',
        color: '#d9534f',
        marginTop: '20px',
    };

    return (
        <div style={containerStyle}>
            <h1 style={h1Style}>Register Page</h1>
            <p style={paragraphStyle}>
                Create an account to access exclusive features and content. If you already have an account, you can log in using the link below.
            </p>
            <form onSubmit={handleRegister} style={formStyle}>
                <h2 style={h2Style}>Register</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    style={inputStyle}
                />
                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    Register
                </button>
                {message && <p style={messageStyle}>{message}</p>}
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    If you have already registered, <Link to="/login">login here</Link>.
                </p>
            </form>
        </div>
    );
};

export default Register;