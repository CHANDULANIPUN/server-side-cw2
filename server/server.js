const express = require('express');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes');


const app = express(); // Initialize the Express application
const PORT = process.env.PORT || 5001;

// Enable CORS for all routes
app.use(cors());

// Middleware to parse JSON bodies
app.use(express.json());

// Use user routes
app.use('/api', userRoutes);

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});