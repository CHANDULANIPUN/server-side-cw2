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
    static async getUserByApiKey(apiKey) {
        try {
            const query = 'SELECT * FROM users WHERE api_key = ?'; // Assuming you have an api_key column
            const [rows] = await db.execute(query, [apiKey]);
            return rows[0]; // Return the first user found
        } catch (error) {
            console.error('Error fetching user by API key:', error);
            throw error; // Rethrow the error for further handling
        }
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
                    resolve(row || null);
                }
            );
        });
    }


    static updateApiKey(username, newApiKey) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET api_key = ? WHERE username = ?`;
            db.run(sql, [newApiKey, username], function (err) {
                if (err) {

                    console.error(`Failed to update API key for user ${username}: ${err.message}`);
                    return reject(new Error(`Failed to update API key: ${err.message}`));
                }


                if (this.changes === 0) {
                    return reject(new Error(`No user found with username: ${username}`));
                }

                resolve(this.changes);
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