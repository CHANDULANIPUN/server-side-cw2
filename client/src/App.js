import React, { useState } from 'react';
import Register from './components/Register';
import Login from './components/Login';
import CountryData from './components/countryData';

const App = () => {
    const [apiKey, setApiKey] = useState('');

    return (
        <div>
            <h1>Country API Middleware</h1>
            {!apiKey ? (
                <>
                    <Register />
                    <Login setApiKey={setApiKey} />
                </>
            ) : (
                <CountryData apiKey={apiKey} />
            )}
        </div>
    );
};

export default App;