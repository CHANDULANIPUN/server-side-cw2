import React, { useState } from 'react';

const ApiKeyManager = () => {
    const [generateUsername, setGenerateUsername] = useState('');
    const [revokeUsername, setRevokeUsername] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const handleGenerate = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5001/api/generate-api-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: generateUsername })
            });

            if (!response.ok) {
                throw new Error('Failed to generate API key');
            }

            const data = await response.json();
            setApiKey(data.apiKey);
            setMessage('New API key generated successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    const handleRevoke = async (event) => {
        event.preventDefault();
        setError('');
        setMessage('');

        try {
            const response = await fetch('http://localhost:5001/api/revoke-api-key', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username: revokeUsername })
            });

            if (!response.ok) {
                throw new Error('Failed to revoke API key');
            }

            setApiKey('');
            setMessage('API key revoked successfully');
        } catch (err) {
            setError(err.message);
        }
    };

    // Inline styles
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
        marginBottom: '20px',
    };

    const h1Style = {
        fontSize: '3em',
        color: '#333',
        marginBottom: '20px',
        marginTop: '30px',
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
        backgroundColor: '#666666',
    };

    const messageStyle = {
        textAlign: 'center',
        color: '#d9534f',
        marginTop: '30px',
    };

    return (
        <div style={containerStyle}>
            <h1 style={h1Style}>API Key Manager</h1>
            
            <form onSubmit={handleGenerate} style={formStyle}>
                <h2 style={h2Style}>Generate API Key</h2>
                <input
                    type="text"
                    value={generateUsername}
                    onChange={(e) => setGenerateUsername(e.target.value)}
                    placeholder="Enter username for generation"
                    required
                    style={inputStyle}
                />
                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor }
                >
                    Generate API Key
                </button>
            </form>

            <form onSubmit={handleRevoke} style={formStyle}>
                <h2 style={h2Style}>Revoke API Key</h2>
                <input
                    type="text"
                    value={revokeUsername}
                    onChange={(e) => setRevokeUsername(e.target.value)}
                    placeholder="Enter username for revocation"
                    required
                    style={inputStyle}
                />
                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => e.target.style.backgroundColor = buttonHoverStyle.backgroundColor}
                    onMouseOut={(e) => e.target.style.backgroundColor = buttonStyle.backgroundColor}
                >
                    Revoke API Key
                </button>
            </form>

            {apiKey && <div style={messageStyle}>Current API key: {apiKey}</div>}
            {message && <div style={messageStyle}>{message}</div>}
            {error && <div style={{ ...messageStyle, color: '#d9534f' }}>Error: {error}</div>}
        </div>
    );
};

export default ApiKeyManager;