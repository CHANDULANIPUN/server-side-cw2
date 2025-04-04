const {db} = require('../config/db');

const apiKeyMiddleware = (req, res, next) => {
    const apiKey = req.headers['x-api-key'];

    if (!apiKey) {
        return res.status(401).json({ message: 'API key is missing' });
    }

    const sql = 'SELECT * FROM api_keys WHERE api_key = ?';
    db.get(sql, [apiKey], (err, row) => {
        if (err) {
            return res.status(500).json({ message: 'Database error', error: err.message });
        }
        if (!row) {
            return res.status(403).json({ message: 'Invalid API key' });
        }

        // Update the last used time and increment usage count
        const updateSql = 'UPDATE api_keys SET last_used = CURRENT_TIMESTAMP, usage_count = usage_count + 1 WHERE id = ?';
        db.run(updateSql, [row.id], (err) => {
            if (err) {
                return res.status(500).json({ message: 'Database error', error: err.message });
            }
            req.user = { id: row.user_id, apiKey: row.api_key };
            next();
        });
    });

};
module.exports = { apiKeyMiddleware };

