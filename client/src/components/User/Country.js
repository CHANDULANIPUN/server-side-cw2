import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CountryDropdown = () => {
    const [countries, setCountries] = useState([]);
    const [selectedCountry, setSelectedCountry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        setLoading(true);
        axios.get('http://localhost:5001/api/countries')
            .then(res => {
                const sorted = res.data.sort((a, b) => a.name.localeCompare(b.name));
                setCountries(sorted);
                setError('');
            })
            .catch(err => {
                console.error('Error fetching countries:', err);
                setError('Failed to fetch country list.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleChange = (e) => {
        const countryName = e.target.value;
        const country = countries.find(c => c.name === countryName);
        setSelectedCountry(country);
    };

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

    const selectStyle = {
        width: '100%',
        padding: '10px',
        border: '1px solid #ccc',
        borderRadius: '4px',
        fontSize: '16px',
        marginBottom: '20px',
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
            <h1 style={{ fontSize: '2.5em', color: '#333', marginBottom: '20px' }}>Country Selector</h1>
            <p style={{ fontSize: '1.2em', color: '#555', marginBottom: '20px' }}>
                Select a country from the dropdown to see its capital, currencies, and flag.
            </p>

            {loading && <p>Loading countries...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {!loading && !error && (
                <select onChange={handleChange} style={selectStyle}>
                    <option value="">-- Select a country --</option>
                    {countries.map((country, index) => (
                        <option key={index} value={country.name}>{country.name}</option>
                    ))}
                </select>
            )}

            {selectedCountry && (
                <div style={countryInfoStyle}>
                    <p><strong>Name:</strong> {selectedCountry.name}</p>
                    <p><strong>Capital:</strong> {selectedCountry.capital}</p>
                    <p><strong>Currencies:</strong> {selectedCountry.currencies}</p>
                    <img src={selectedCountry.flag} alt={`${selectedCountry.name} flag`} style={flagStyle} />
                </div>
            )}
        </div>
    );
};

export default CountryDropdown;
