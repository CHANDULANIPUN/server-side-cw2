const db = require('../config/db');
const User = require('../models/userModel');

class UserDao {
    static findUserByUsername(username) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE username = ?";
            db.get(sql, [username], (err, row) => {
                if (err) {
                    console.error(`Error fetching user: ${err.message}`);
                    return reject(err);
                }
                resolve(row); // Will be null if no user is found
            });
        });
    }

    static createUser (username, password, role = 'user') {
        return new Promise((resolve, reject) => {
            if (!username || !password) {
                return reject(new Error('Invalid input: username and password are required'));
            }

            db.run(
                "INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
                [username, password, role],
                function (err) {
                    if (err) {
                        return reject(new Error(`Failed to create user: ${err.message}`));
                    }
                    resolve(this.lastID);
                }
            );
        });
    }

    static getUserByApiKey(apiKey) {
        return new Promise((resolve, reject) => {
            if (!apiKey) {
                return reject(new Error('Invalid input: apiKey is required'));
            }

            const sql = "SELECT * FROM users WHERE api_key = ?";
            db.get(sql, [apiKey], (err, row) => {
                if (err) {
                    console.error(`Database error: ${err.message}`);
                    return reject(new Error('Failed to fetch user by API key'));
                }
                resolve(row || null); // Return null if no user is found
            });
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
                        console.error(`Database error: ${err.message}`);
                        return reject(new Error('Failed to fetch user by username'));
                    }
                    resolve(row || null); // Return null if no user is found
                }
            );
        });
    }

    static updateApiKey(username, newApiKey) {
        return new Promise((resolve, reject) => {
            if (!username || !newApiKey) {
                return reject(new Error('Invalid input: username and newApiKey are required'));
            }
    
            const sql = `UPDATE users SET api_key = ? WHERE username = ?`;
            db.run(sql, [newApiKey, username], function (err) {
                if (err) {
                    console.error(`Failed to update API key for user ${username}: ${err.message}`);
                    return reject(new Error('Failed to update API key'));
                }
    
                if (this.changes === 0) {
                    console.error(`No user found with username: ${username}`);
                    return reject(new Error(`No user found with username: ${username}`));
                }
    
                console.log(`API key updated for user ${username}`);
                resolve(this.changes); // Resolve with the number of changes
            });
        });
    }


    static revokeApiKey(username) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET api_key = NULL WHERE username = ?`;
            db.run(sql, [username], function (err) {
                if (err) {
                    console.error(`Failed to revoke API key for user ${username}: ${err.message}`);
                    return reject(new Error(`Failed to revoke API key: ${err.message}`));
                }

                if (this.changes === 0) {
                    return reject(new Error(`No user found with username: ${username}`));
                }

                resolve(this.changes);
            });
        });
    }
}



module.exports = UserDao;