const db = require('../config/db');

class BlogDao {
    // Create a new blog post
    static createPost(username, title, content, countryName, dateOfVisit, callback) {
        const sql = `
            INSERT INTO blog (user_name, title, content, country_name, date_of_visit)
            VALUES (?, ?, ?, ?, ?)
        `;
        db.run(sql, [username, title, content, countryName, dateOfVisit], function (err) {
            if (err) {
                return callback(err); // Pass the error to the callback
            }
            // Instead of returning lastID, just return a success message
            callback(null, { message: 'Post created successfully' });
        });
    }

    // Update an existing blog post
    static updatePost(postId, username, title, content, countryName, dateOfVisit, callback) {
        const sql = `
            UPDATE blog
            SET title = ?, content = ?, country_name = ?, date_of_visit = ?
            WHERE id = ? AND username = ?
        `;
        db.run(sql, [title, content, countryName, dateOfVisit, postId, username], function (err) {
            if (err) {
                return callback(err); // Pass the error to the callback
            }
            callback(null, { message: 'Post updated successfully', changes: this.changes });
        });
    }

    // Delete a blog post
    static deletePost(postId, username, callback) {
        const sql = `
            DELETE FROM blog
            WHERE id = ? AND username = ?
        `;
        db.run(sql, [postId, username], function (err) {
            if (err) {
                return callback(err); // Pass the error to the callback
            }
            callback(null, { message: 'Post deleted successfully', changes: this.changes });
        });
    }

    // Get all blog posts
    static getAllPosts(callback) {
        const sql = `SELECT * FROM blog`;
        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    }

    // Get a single blog post by ID
    static getPostById(postId, callback) {
        const sql = `SELECT * FROM blog WHERE id = ?`;
        db.get(sql, [postId], (err, row) => {
            callback(err, row);
        });
    }

    // Serch by username and country name
    static searchPosts(countryName, username, page, limit, callback) {
        let sql = `
            SELECT id, title, content, user_name, country_name, date_of_visit
            FROM blog
            WHERE 1=1
        `;
        const params = [];

        if (countryName) {
            sql += ' AND country_name LIKE ?';
            params.push(`%${countryName}%`);
        }

        if (username) {
            sql += ' AND user_name LIKE ?';
            params.push(`%${username}%`);
        }

        sql += ' ORDER BY date_of_visit DESC LIMIT ? OFFSET ?';
        const offset = (page - 1) * limit;
        params.push(parseInt(limit), offset);

        db.all(sql, params, (err, rows) => {
            if (err) return callback(err);

            // Count total matching posts for pagination
            let countSql = `
                SELECT COUNT(*) AS total
                FROM blog
                WHERE 1=1
            `;
            const countParams = [];
            if (countryName) {
                countSql += ' AND country_name LIKE ?';
                countParams.push(`%${countryName}%`);
            }
            if (username) {
                countSql += ' AND user_name LIKE ?';
                countParams.push(`%${username}%`);
            }

            db.get(countSql, countParams, (err, countResult) => {
                if (err) return callback(err);
                callback(null, { posts: rows, total: countResult.total });
            });
        });
    }

}

module.exports = BlogDao;