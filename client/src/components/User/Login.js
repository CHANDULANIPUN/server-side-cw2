import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = ({ setApiKey, setUserId }) => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5001/api/login', { username, email, password });

            const apiKey = response.data.apiKey;
            const userId = response.data.userId; // ✅ make sure backend sends this

            setApiKey(apiKey);
            setUserId(userId);

            localStorage.setItem('apiKey', apiKey);
            localStorage.setItem('userId', userId);

            setMessage('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            setMessage('Login failed: ' + (error.response?.data?.error || error.message));
        }
    };

    // Styles
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
        minHeight: '100vh',
        backgroundColor: '#f2f2f2',
        padding: '40px 20px',
    };

    const formStyle = {
        maxWidth: '400px',
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        backgroundColor: '#f9f9f9',
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
        backgroundColor: '#666666',
    };

    const messageStyle = {
        textAlign: 'center',
        color: '#d9534f',
        marginTop: '30px',
    };

    return (
        <div style={containerStyle}>
            <h1>Login Page</h1>
            <p style={{ textAlign: 'center', marginBottom: '30px' }}>
                Welcome! Please log in to access your dashboard.
            </p>

            <form onSubmit={handleLogin} style={formStyle}>
                <h2 style={{ textAlign: 'center', marginBottom: '20px' }}>Login</h2>
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    style={inputStyle}
                />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    onMouseOver={(e) => (e.target.style.backgroundColor = buttonHoverStyle.backgroundColor)}
                    onMouseOut={(e) => (e.target.style.backgroundColor = buttonStyle.backgroundColor)}
                >
                    Login
                </button>
                {message && <p style={messageStyle}>{message}</p>}
                <p style={{ textAlign: 'center', marginTop: '10px' }}>
                    If you are not registered, <Link to="/register">register here</Link>.
                </p>
            </form>
        </div>
    );
};

export default Login;
