import React, { useState } from 'react';
import axios from 'axios';

const Login = ({ setApiKey }) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/api/login', { username, password });
            setApiKey(response.data.apiKey);
            setMessage('Login successful!');
        } catch (error) {
            setMessage(' Login failed: ' + error.response.data.error);
        }
    };

    return (
        <form onSubmit={handleLogin}>
            <h2>Login</h2>
            <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} required />
            <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            <button type="submit">Login</button>
            {message && <p>{message}</p>}
        </form>
    );
};

export default Login;