const User = require('../models/User');
const bcrypt = require('bcrypt');

exports.register = async (req, res) => {
    const { username, password } = req.body;
    try {
        const existinguser = await UserActivation.findByUsername(username);
        if (existinguser) {
            return res.status(400).json({ error: 'Username already exists' });
        }

        const user = await User.create({ username, password });
        res.status(201).json({ message: 'User created successfully', apiKey: user.apiKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
};

// Function to handle user login
exports.login = async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Use bcrypt to compare password hashes
        const isPasswordValid = await bcrypt.campare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }
        res.status(200).json({ message: 'Login successful', token: user.apiKey });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error.message || 'Login failed' });
    }
};