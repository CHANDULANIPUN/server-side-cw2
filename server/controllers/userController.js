const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const UserDao = require('../dao/userDao');
const crypto = require('crypto');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret'; 


exports.registerUser  = async (req, res) => {
    const { username, password, role } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Please add all fields' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        // Use the provided role or default to 'user' if not specified
        const userId = await UserDao.createUser (username, hashedPassword, role || 'user');
        res.status(201).json({ message: 'User  registered successfully', userId });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};
exports.createAdminUser  = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        // Check if the username already exists
        const existingUser  = await UserDao.findUserByUsername(username);
        if (existingUser ) {
            return res.status(409).json({ error: 'Username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Generate a unique API key
        const apiKey = crypto.randomBytes(16).toString('hex');

        // Create the user with the role 'admin' and the generated API key
        const newUserId = await UserDao.createUser (username, hashedPassword, 'admin', apiKey);

        // Respond with the user details including the API key
        res.status(201).json({
            message: 'Admin user created successfully',
            userId: newUserId,
            username: username,
            role: 'admin',
            apiKey: apiKey
        });
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ error: 'Failed to create admin user' });
    }
};

exports.loginUser  = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await UserDao.getUserByUsername(username);
        console.log('Retrieved user:', user);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Generate a new API key
        const apiKey = uuidv4();
        console.log('Generated API key:', apiKey);

        // Update the API key in the database
        await UserDao.updateApiKey(user.username, apiKey);
        console.log('API key updated for user:', user.username);

        res.status(200).json({ message: 'Login successful', apiKey });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};

exports.adminlogin  = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Username and password are required' });
    }

    try {
        const user = await UserDao.getUserByUsername(username);
        console.log('Retrieved user:', user);

        if (!user) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        // Check if user role is not admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }

        // Generate a new API key
        const apiKey = uuidv4();
        console.log('Generated API key:', apiKey);

        // Update the API key in the database
        await UserDao.updateApiKey(user.username, apiKey);
        console.log('API key updated for user:', user.username);

        // Return success response with API key and role
        res.status(200).json({ message: 'Login successful', apiKey, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};

exports.generateApiKey = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    const uniqueId = uuidv4();
    const newApiKey = jwt.sign({ username, uniqueId }, JWT_SECRET, { expiresIn: '30d' });

    try {
        await UserDao.updateApiKey(username, newApiKey); // Ensure this method updates the user's API key in the database
        res.json({ message: 'New API key generated', apiKey: newApiKey });
    } catch (error) {
        console.error('Error generating API key:', error);
        res.status(500).json({ error: 'Failed to generate API key' });
    }
};

exports.revokeApiKey = async (req, res) => {
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'Username is required' });
    }

    try {
        await UserDao.revokeApiKey(username); // Ensure this method revokes the user's API key in the database
        res.json({ message: 'API key revoked successfully' });
    } catch (error) {
        console.error('Error revoking API key:', error);
        res.status(500).json({ error: 'Failed to revoke API key' });
    }
};
async function getCountryWithRetries(name, retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get(`https://restcountries.com/v3.1/name/${name}`);
            return response.data;
        } catch (error) {
            if (i === retries - 1) {
                console.error(`Failed to fetch country information for "${name}" after ${retries} retries:`, error.message);
                throw error; 
            }
            console.log(`Retrying... (${i + 1})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

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