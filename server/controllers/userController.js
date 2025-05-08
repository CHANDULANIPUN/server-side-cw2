const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const UserDao = require('../dao/userDao');
const { v4: uuidv4 } = require('uuid');

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret';

exports.registerUser = async (req, res) => {
    const { username, email, password, role } = req.body;

    if (!username|| !email || !password) {
        return res.status(400).json({ error: 'Please add all fields' });
    }

    // Regular expression for validating an Email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    try {
        const existingUser = await UserDao.findUserByEmail(email);
        if (existingUser) {
            return res.status(400).json({ error: 'User  already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const userId = await UserDao.createUser(username, email, hashedPassword, role || 'user');
        res.status(201).json({ message: 'User  registered successfully', userId });
    } catch (error) {
        res.status(500).json({ error: 'Internal server error' });
    }
};
exports.loginUser = async (req, res) => {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Username, email, and password are required' });
    }

    try {
        const user = await UserDao.getUserByEmail(email);
        console.log('Retrieved user:', user);

        if (!user) {
            return res.status(401).json({ error: 'There is no User' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        const apiKey = uuidv4();
        console.log('Generated API key:', apiKey);

        await UserDao.updateApiKey(user.email, apiKey);

        
        res.status(200).json({
            message: 'Login successful',
            apiKey,
            userId: user.id, 
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};

exports.logoutUser  = async (req, res) => {
    console.log('Received body:', req.body);
    const { apiKey } = req.body;

    if (!apiKey) {
        return res.status(400).json({ error: 'API key is required' });
    }

    try {
        // Fetch the user by API key
        const user = await UserDao.getUserByApiKey(apiKey);
        if (!user) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        // Revoke the API key by setting it to NULL
        await UserDao.revokeApiKey(user.email);

        console.log(`User  ${user.email} logged out successfully.`);

        res.status(200).json({ message: 'Logout successful' });
    } catch (error) {
        console.error('Error during logout:', error.message || error);
        res.status(500).json({ error: 'Failed to log out' });
    }
};
exports.createAdminUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        // Check if the Email already exists
        const existingUser = await UserDao.findUserByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create the user with the role 'admin' and the generated API key
        const newUserId = await UserDao.createUser(email, hashedPassword, 'admin');

        // Respond with the user details including the API key
        res.status(201).json({
            message: 'Admin user created successfully',
            userId: newUserId,
            username: email,
            role: 'admin',
        });
    } catch (error) {
        console.error('Error creating admin user:', error);
        res.status(500).json({ error: 'Failed to create admin user' });
    }
};


exports.adminlogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    try {
        const user = await UserDao.getUserByEmail(email);
        console.log('Retrieved user:', user);

        if (!user) {
            return res.status(401).json({ error: 'Email username or password' });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        console.log('Password valid:', isPasswordValid);

        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid email or password' });
        }

        // Check if user role is not admin
        if (user.role !== 'admin') {
            return res.status(403).json({ error: 'Access denied: Admins only' });
        }

        // Generate a new API key
        const apiKey = uuidv4();
        console.log('Generated API key:', apiKey);

        // Update the API key in the database
        await UserDao.updateApiKey(user.email, apiKey);
        console.log('API key updated for user:', user.email);

        // Return success response with API key and role
        res.status(200).json({ message: 'Admin Login Sucessfully', apiKey, role: user.role });
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
async function getAllCountriesWithRetries(retries = 3) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await axios.get('https://restcountries.com/v3.1/all');
            return response.data;
        } catch (error) {
            if (i === retries - 1) {
                console.error(`Failed to fetch all countries after ${retries} retries:`, error.message);
                throw error;
            }
            console.log(`Retrying fetch all countries... (${i + 1})`);
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
    }
}

exports.getAllCountries = async (req, res) => {
    try {
        const data = await getAllCountriesWithRetries();

        const countryList = data.map(country => ({
            name: country.name?.common || 'N/A',
            capital: country.capital ? country.capital[0] : 'N/A',
            currencies: country.currencies ? Object.values(country.currencies).map(c => c.name).join(', ') : 'N/A',
            languages: country.languages ? Object.values(country.languages).join(', ') : 'N/A',
            flag: country.flags?.svg || 'N/A'
        }));

        res.json(countryList);
    } catch (error) {
        console.error('Error fetching all countries:', error.message);
        res.status(500).json({ error: 'Failed to fetch all country data' });
    }
};


exports.followUser = async (req, res) => {
    const { followerId, followingId } = req.body;    

    if (!followerId || !followingId) {
        return res.status(400).json({ error: 'Follower ID and following ID are required' });
    }

    try {
        const alreadyFollowing = await UserDao.isFollowing(followerId, followingId);
        if (alreadyFollowing) {
            return res.status(400).json({ error: 'Already following this user' });
        }

        await UserDao.followUser(followerId, followingId);
        res.status(200).json({ message: 'Followed successfully' });
    } catch (error) {
        console.error('Error following user:', error);
        res.status(500).json({ error: 'Failed to follow user' });
    }
};

exports.unfollowUser = async (req, res) => {
    const { followerId, followingId } = req.body;

    if (!followerId || !followingId) {
        return res.status(400).json({ error: 'Follower ID and following ID are required' });
    }

    try {
        await UserDao.unfollowUser(followerId, followingId);
        res.status(200).json({ message: 'Unfollowed successfully' });
    } catch (error) {
        console.error('Error unfollowing user:', error);
        res.status(500).json({ error: 'Failed to unfollow user' });
    }
};

exports.getFollowers = async (req, res) => {
    const { userId } = req.params;

    try {
        const followers = await UserDao.getFollowers(userId);
        res.status(200).json({ followers });
    } catch (error) {
        console.error('Error getting followers:', error);
        res.status(500).json({ error: 'Failed to get followers' });
    }
};

exports.getFollowing = async (req, res) => {
    const { userId } = req.params;

    try {
        const following = await UserDao.getFollowing(userId);
        res.status(200).json({ following });
    } catch (error) {
        console.error('Error getting following:', error);
        res.status(500).json({ error: 'Failed to get following' });
    }
};


exports.getFollowingFeed = async (req, res) => {
    const { userId } = req.params;

    try {
        const posts = await UserDao.getFeedPosts(userId);
        res.status(200).json({ posts });
    } catch (error) {
        console.error('Error getting following feed:', error);
        res.status(500).json({ error: 'Failed to get following feed' });
    }
};

exports.getUserById = async (req, res) => {
    const userId = req.params.userId;
    try {
        const user = await UserDao.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        res.json({ id: user.id, username: user.username, email: user.email });
    } catch (error) {
        console.error('Error fetching user by id:', error);
        res.status(500).json({ error: 'Failed to fetch user' });
    }
};

