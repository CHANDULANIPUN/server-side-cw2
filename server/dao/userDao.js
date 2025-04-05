const db = require('../config/db');
const User = require('../models/userModel');

class UserDao {
    static createUser(username, password, apiKey) {
        return new Promise((resolve, reject) => {
            if (!username || !password || !apiKey) {
                return reject(new Error('Invalid input: username, password, and apiKey are required'));
            }

            db.run(
                "INSERT INTO users (username, password, api_key) VALUES (?, ?, ?)",
                [username, password, apiKey],
                function (err) {
                    if (err) {
                        return reject(new Error(`Failed to create user: ${err.message}`));
                    }
                    resolve(this.lastID);
                }
            );
        });
    }

    static getUserByUsername(username) {
        return new Promise((resolve, reject) => {
            if (!username) {
                return reject(new Error('Invalid input: username is required'));
            }

            db.get(
                "SELECT * FROM users WHERE username = ?",
                [username],
                (err, row) => {
                    if (err) {
                        return reject(new Error(`Failed to fetch user by username: ${err.message}`));
                    }
                    resolve(row || null); // Explicitly return `null` if no user is found
                }
            );
        });
    }
}

module.exports = UserDao;