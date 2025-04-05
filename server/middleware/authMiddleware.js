const db = require('../config/db');

const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];
    if (!apiKey) return res.status(403).json({ error: 'API key required' });

    db.get("SELECT * FROM users WHERE api_key = ?", [apiKey], (err, user) => {
        if (err || !user) {
            return res.status(403).json({ error: 'Invalid API key' });
        }
        req.user = user;
        next();
    });
};

module.exports = authenticate;