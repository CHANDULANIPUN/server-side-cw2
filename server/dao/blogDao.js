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
    static updatePost(postId, title, content, country_name, date_of_visit, callback) {
        const sql = `
            UPDATE blog
            SET title = ?, content = ?, country_name = ?, date_of_visit = ?
            WHERE id = ?
        `;
        db.run(sql, [title, content, country_name, date_of_visit, postId], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.changes);
        });
    }


    // Delete a blog post
    static deletePost(postId, callback) {
        const sql = `DELETE FROM blog WHERE id = ?`;
        db.run(sql, [postId], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.changes);
        });
    }


    // Get all blog posts
    static getAllPosts(callback) {
        const sql = `
            SELECT 
                b.*, 
                COALESCE(SUM(CASE WHEN pl.is_like = 1 THEN 1 ELSE 0 END), 0) AS likes,
                COALESCE(SUM(CASE WHEN pl.is_like = 0 THEN 1 ELSE 0 END), 0) AS dislikes
            FROM blog b
            LEFT JOIN post_likes pl ON b.id = pl.blog_id
            GROUP BY b.id
        `;
        db.all(sql, [], (err, rows) => {
            callback(err, rows);
        });
    }

    static getPostsByUser(username, callback) {
        const sql = `SELECT * FROM blog WHERE user_name = ?`;
        db.all(sql, [username], (err, rows) => {
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
    static searchPosts(query, page, limit, callback) {
        const searchTerm = `%${query}%`;
        const offset = (page - 1) * limit;

        const dataSql = `
            SELECT *
            FROM blog
            WHERE title LIKE ? OR content LIKE ? OR user_name LIKE ? OR country_name LIKE ?
            ORDER BY created_at DESC
            LIMIT ? OFFSET ?
        `;
        const countSql = `
            SELECT COUNT(*) as total
            FROM blog
            WHERE title LIKE ? OR content LIKE ? OR user_name LIKE ? OR country_name LIKE ?
        `;

        const params = [searchTerm, searchTerm, searchTerm, searchTerm, parseInt(limit), offset];
        const countParams = [searchTerm, searchTerm, searchTerm, searchTerm];

        db.get(countSql, countParams, (err, countResult) => {
            if (err) return callback(err);

            db.all(dataSql, params, (err, rows) => {
                if (err) return callback(err);
                callback(null, { posts: rows, total: countResult.total });
            });
        });
    }


    static likePost(postId, userId, callback) {
        const sql = `
            INSERT INTO post_likes (user_id, blog_id, is_like)
            VALUES (?, ?, 1)
            ON CONFLICT(user_id, blog_id) DO UPDATE SET is_like = 1
        `;
        db.run(sql, [userId, postId], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, { message: 'Post liked successfully' });
        });
    }
    static dislikePost(postId, userId, callback) {
        const sql = `
            INSERT INTO post_likes (user_id, blog_id, is_like)
            VALUES (?, ?, 0)
            ON CONFLICT(user_id, blog_id) DO UPDATE SET is_like = 0
        `;
        db.run(sql, [userId, postId], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, { message: 'Post disliked successfully' });
        });
    }

    // dao/BlogDao.js

    static getSortedPosts(sortBy) {
        return new Promise((resolve, reject) => {
            let sql;

            if (sortBy === 'most_liked') {
                sql = `
                    SELECT b.*, COUNT(pl.id) AS like_count
                    FROM blogs b
                    LEFT JOIN post_likes pl ON b.id = pl.post_id AND pl.is_liked = 1
                    GROUP BY b.id
                    ORDER BY like_count DESC;
                `;
            } else {
                // Default to newest
                sql = `
                    SELECT * FROM blogs
                    ORDER BY date_of_visit DESC;
                `;
            }

            db.all(sql, [], (err, rows) => {
                if (err) {
                    console.error(`Database error while fetching sorted posts: ${err.message}`);
                    return reject(err);
                }
                resolve(rows || []);  // always return an array
            });
        });
    }



}

module.exports = BlogDao;