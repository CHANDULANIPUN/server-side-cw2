const UserDao = require('../dao/userDao');


async function authenticate(req, res, next) {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ error: 'API key is required' });
    }

    try {
        const user = await UserDao.getUserByApiKey(apiKey);
        if (!user) {
            return res.status(401).json({ error: 'Invalid API key' });
        }

        req.user = user; // Attach user to request object
        next(); // Proceed to the next middleware or route handler
    } catch (error) {
        console.error('Authentication error:', error.message);
        res.status(500).json({ error: 'Failed to authenticate' });
    }
}
// Middleware to check if the user is an admin
const isAdmin = async (req, res, next) => {
    if (!req.user) {
        return res.status(403).json({ error: 'User  not authenticated' });
    }

    const { username } = req.user;

    try {
        const user = await UserDao.getUserByUsername(username);
        if (user && user.role === 'admin') {
            next(); // User is an admin, proceed to the next middleware
        } else {
            res.status(403).json({ error: 'Access denied. Admins only.' });
        }
    } catch (error) {
        console.error('Error checking user role:', error);
        res.status(500).json({ error: 'Failed to check user role' });
    }
};

// Export the middleware
module.exports = { authenticate, isAdmin };