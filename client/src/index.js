import React from 'react';
import ReactDOM from 'react-dom/client'; // Import the new API
import App from './App';
import './index.css';

// Create a root and render the App component
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);