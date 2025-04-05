const express = require('express');
const axios = require('axios'); // Import axios
const { registerUser, loginUser } = require('../controllers/userController.js');
const authenticate = require('../middleware/authMiddleware'); // Correct import

const router = express.Router();

// Helper function to fetch country data with retries
async function getCountryWithRetries(name, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
            return response.data;
        } catch (error) {
            if (i === retries - 1) {
                console.error(`Failed to fetch country information for "${name}" after ${retries} retries:`, error.message);
                throw error; // Throw error after all retries fail
            }
            console.log(`Retrying... (${i + 1})`);
            await new Promise(resolve => setTimeout(resolve, 1000)); // Add a 1-second delay
        }
    }
}

// Route to fetch country information
router.get('/countries/:name', authenticate, async (req, res) => {
    const { name } = req.params;

    console.log(`Country name received: ${name}`);

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Country name is required and must be a valid string' });
    }

    try {
        console.log(`Fetching country data for: ${name}`);
        const data = await getCountryWithRetries(name);
        console.log(`Country data fetched:`, data);

        const country = data[0]; // Extract the first country from the response
        const countryInfo = {
            name: country.name?.common || 'N/A',
            capital: country.capital ? country.capital[0] : 'N/A',
            currencies: country.currencies
                ? Object.values(country.currencies).map(c => c.name).join(', ')
                : 'N/A',
            languages: country.languages
                ? Object.values(country.languages).join(', ')
                : 'N/A',
            flag: country.flags?.svg || 'N/A'
        };

        console.log(`Country info to send:`, countryInfo);
        res.json(countryInfo);
    } catch (error) {
        console.error(`Error fetching country information for "${name}":`, error.response?.data || error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: `Country not found: ${name}` });
        }
        res.status(500).json({ error: 'Failed to fetch country information' });
    }
});

router.post('/register', registerUser);
router.post('/login', loginUser);

module.exports = router;