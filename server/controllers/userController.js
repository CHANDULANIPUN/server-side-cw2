// controllers/userController.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const UserDao = require('../dao/userDao');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; // Use environment variables in production

// Register User
exports.registerUser  = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please add all fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const apiKey = uuidv4(); // Generate a unique API key

    try {
        await UserDao.createUser (username, hashedPassword, apiKey);
        res.status(201).json({ message: 'User  registered successfully', apiKey });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
// Login User
exports.loginUser  = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please add all fields' });
    }

    try {
        const user = await UserDao.getUserByUsername(username);
        if (!user) {
            return res.status(400).json({ error: 'User  not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        res.json({ apiKey: user.api_key });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


exports.generateApiKey = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    // Generate a unique identifier
    const uniqueId = uuidv4();

    // Include the unique identifier in the JWT payload
    const newApiKey = jwt.sign({ username, uniqueId }, JWT_SECRET, { expiresIn: '30d' });

    try {
        await UserDao.updateApiKey(username, newApiKey);
        res.json({ message: 'New API key generated', apiKey: newApiKey });
    } catch (error) {
        console.error('Error generating API key:', error);
        res.status(500).json({ error: 'Failed to generate API key' });
    }
};
// Revoke API Key
exports.revokeApiKey = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        await UserDao.revokeApiKey(username);
        res.json({ message: 'API key revoked successfully' });
    } catch (error) {
        console.error('Error revoking API key:', error);
        res.status(500).json({ error: 'Failed to revoke API key' });
    }
};
// Helper function to fetch country information with retries
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

// Function to get country data
exports.getCountryData = async (req, res) => {
    const { name } = req.params;

    if (!name || typeof name !== 'string' || name.trim() === '') {
        return res.status(400).json({ error: 'Country name is required and must be a valid string' });
    }

    try {
        const data = await getCountryWithRetries(name);
        const country = data[0];
        const countryInfo = {
            name: country.name?.common || 'N/A',
            capital: country.capital ? country.capital[0] : 'N/A',
            currencies: country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A',
            languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
            flag: country.flags?.svg || 'N/A'
        };
        res.json(countryInfo);
    } catch (error) {
        console.error(`Error fetching country information for "${name}":`, error.message);
        if (error.response && error.response.status === 404) {
            return res.status(404).json({ error: `Country not found: ${name}` });
        }
        res.status(500).json({ error: 'Failed to fetch country information' });
    }
};