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
            const response = await axios.get(`http://localhost:5000/api/countries/${countryName}`, {
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

    return (
        <div>
            <h2>Country Data</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={countryName}
                    onChange={(e) => setCountryName(e.target.value)}
                    placeholder="Enter country name"
                />
                <button type="submit">Submit</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {country && (
                <div>
                    <p><strong>Name:</strong> {country.name}</p>
                    <p><strong>Capital:</strong> {country.capital}</p>
                    <p><strong>Currencies:</strong> {country.currencies}</p>
                    <p><strong>Languages:</strong> {country.languages}</p>
                    <img src={country.flag} alt={`${country.name} flag`} style={{ width: '200px' }} />
                </div>
            )}
        </div>
    );
};

export default CountryData;