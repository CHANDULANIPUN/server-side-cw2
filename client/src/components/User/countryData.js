import React, { useState } from 'react';
import axios from 'axios';

const CountryData = ({ apiKey }) => {
    const [countryName, setCountryName] = useState('');
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const fetchCountry = async () => {
        setLoading(true);
        setError('');
        setCountry(null); // Clear previous data
        try {
            const response = await axios.get(`http://localhost:5001/api/countries/${countryName}`, {
                headers: { 'x-api-key': apiKey }
            });
            setCountry(response.data);
        } catch (err) {
            setError('Failed to fetch country: ' + err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault(); // Prevent form submission
        if (countryName.trim() !== '') {
            fetchCountry();
        } else {
            setError('Please enter a valid country name.');
        }
    };

    // Inline styles
    const containerStyle = {
        maxWidth: '600px',
        margin: '0 auto',
        marginTop: '190px',
        
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        borderRadius: '8px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
    };

    const inputStyle = {
        width: 'calc(100% - 22px)',
        padding: '10px',
        marginBottom: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        transition: 'border-color 0.3s ease',
    };

    const buttonStyle = {
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '16px',
        cursor: 'pointer',
        transition: 'background-color 0.3s ease, transform 0.3s ease',
    };

    const buttonHoverStyle = {
        backgroundColor: '#0056b3',
        transform: 'scale(1.05)',
    };

    const countryInfoStyle = {
        marginTop: '20px',
        textAlign: 'left',
        backgroundColor: '#ffffff',
        padding: '15px',
        borderRadius: '8px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    const flagStyle = {
        width: '100%',
        maxWidth: '200px',
        marginTop: '10px',
        borderRadius: '4px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
    };

    return (
        <div style={containerStyle}>
            <h1 style={{ fontSize: '2.5em', color: '#333', marginBottom: '20px' }}>Country Information</h1>
            <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '20px' }}>
                Enter the name of a country to get detailed information about it, including its capital, currencies, languages, and flag.
            </p>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    placeholder="Enter country name"
                    style={inputStyle}
                />
                <button
                    type="submit"
                    style={buttonStyle}
                    onMouseOver={(e) => {
                        e.target.style.backgroundColor = buttonHoverStyle.backgroundColor;
                        e.target.style.transform = buttonHoverStyle.transform;
                    }}
                    onMouseOut={(e) => {
                        e.target.style.backgroundColor = buttonStyle.backgroundColor;
                        e.target.style.transform = 'scale(1)';
                    }}
                >
                    Submit
                </button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {country && (
                <div style={ countryInfoStyle}>
                    <p><strong>Name:</strong> {country.name}</p>
                    <p><strong>Capital:</strong> {country.capital}</p>
                    <p><strong>Currencies:</strong> {country.currencies}</p>
                    <p><strong>Languages:</strong> {country.languages}</p>
                    <img src={country.flag} alt={`${country.name} flag`} style={flagStyle} />
                </div>
            )}
        </div>
    );
};

export default CountryData;