const db = require('../config/db');
const User = require('../models/userModel');

class UserDao {
    static createUser(username, email, password, role = 'user') {
        return new Promise((resolve, reject) => {
            if (!username || !email || !password) {
                return reject(new Error('Invalid input: username email and password are required'));
            }

            db.run(
                "INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)",
                [username, email, password, role],
                function (err) {
                    if (err) {
                        return reject(new Error(`Failed to create user: ${err.message}`));
                    }
                    resolve(this.lastID);
                }
            );
        });
    }
    static findUserByEmail(email) {
        return new Promise((resolve, reject) => {
            const sql = "SELECT * FROM users WHERE email = ?";
            db.get(sql, [email], (err, row) => {
                if (err) {
                    console.error(`Error fetching user: ${err.message}`);
                    return reject(err);
                }
                resolve(row);
            });
        });
    }

    static getUserByEmail(email) {
        return new Promise((resolve, reject) => {
            if (!email) {
                return reject(new Error('Invalid input: email is required'));
            }

            const sql = "SELECT id, username, email, password, api_key, role FROM users WHERE email = ?";

            db.get(sql, [email], (err, row) => {
                if (err) {
                    console.error(`Database error while fetching user by email: ${err.message}`);
                    return reject(new Error('Failed to fetch user by email'));
                }

                if (!row) {
                    console.warn(`No user found with email: ${email}`);
                    return resolve(null); // Resolve null if no user is found
                }

                resolve(row); // Return the user row if found
            });
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

    static updateApiKey(email, newApiKey) {
        return new Promise((resolve, reject) => {
            if (!email || !newApiKey) {
                return reject(new Error('Invalid input: email and newApiKey are required'));
            }

            const sql = `UPDATE users SET api_key = ? WHERE email = ?`;
            db.run(sql, [newApiKey, email], function (err) {
                if (err) {
                    console.error(`Failed to update API key for user ${email}: ${err.message}`);
                    return reject(new Error('Failed to update API key'));
                }

                if (this.changes === 0) {
                    console.error(`No user found with email: ${email}`);
                    return reject(new Error(`No user found with email: ${email}`));
                }

                console.log(`API key updated for user ${email}`);
                resolve(this.changes); // Resolve with the number of changes
            });
        });
    }

    static revokeApiKey(email) {
        return new Promise((resolve, reject) => {
            const sql = `UPDATE users SET api_key = NULL WHERE email = ?`;
            db.run(sql, [email], function (err) {
                if (err) {
                    console.error(`Failed to revoke API key for user ${email}: ${err.message}`);
                    return reject(new Error(`Failed to revoke API key: ${err.message}`));
                }

                if (this.changes === 0) {
                    return reject(new Error(`No user found with email: ${email}`));
                }

                resolve(this.changes);
            });
        });
    }

    static isFollowing(followerId, followingId) {
        return new Promise((resolve, reject) => {
            const sql = `SELECT 1 FROM follows WHERE follower_id = ? AND following_id = ?`;
            db.get(sql, [followerId, followingId], (err, row) => {
                if (err) return reject(err);
                resolve(!!row);
            });
        });
    }

    static followUser(followerId, followingId) {
        return new Promise((resolve, reject) => {
            const sql = `INSERT INTO follows (follower_id, following_id) VALUES (?, ?)`;
            db.run(sql, [followerId, followingId], function (err) {
                if (err) return reject(err);
                resolve(this.lastID);
            });
        });
    }

    static unfollowUser(followerId, followingId) {
        return new Promise((resolve, reject) => {
            const sql = `DELETE FROM follows WHERE follower_id = ? AND following_id = ?`;
            db.run(sql, [followerId, followingId], function (err) {
                if (err) return reject(err);
                resolve(this.changes); // returns number of rows deleted
            });
        });
    }

    static getFollowers(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT users.id, users.username 
                FROM follows 
                JOIN users ON follows.follower_id = users.id 
                WHERE follows.following_id = ?
            `;
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static getFollowing(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT users.id, users.username 
                FROM follows 
                JOIN users ON follows.following_id = users.id 
                WHERE follows.follower_id = ?
            `;
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }

    static getFeedPosts(userId) {
        return new Promise((resolve, reject) => {
            const sql = `
                SELECT b.*, u.username AS user_name
                FROM blog b
                JOIN follows f ON b.user_id = f.following_id
                JOIN users u ON b.user_id = u.id
                WHERE f.follower_id = ?
                ORDER BY b.created_at DESC
            `;
            db.all(sql, [userId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
    


    static getUserById(userId) {
        return new Promise((resolve, reject) => {
            // Validate input
            if (!userId) {
                return reject(new Error('Invalid input: userId is required'));
            }

            const sql = "SELECT id, username, email FROM users WHERE id = ?";

            db.get(sql, [userId], (err, row) => {
                if (err) {
                    console.error(`Database error while fetching user by id: ${err.message}`);
                    return reject(new Error('Failed to fetch user by id'));
                }

                if (!row) {
                    console.warn(`No user found with id: ${userId}`);
                    return resolve(null);
                }

                resolve(row);
            });
        });
    }


}



module.exports = UserDao;