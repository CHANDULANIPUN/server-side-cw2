const db = require('../config/db');

class BlogDao {
    static createPost(userId, username, title, content, countryName, dateOfVisit, callback) {
        const sql = `
            INSERT INTO blog (user_id, user_name, title, content, country_name, date_of_visit)
            VALUES (?, ?, ?, ?, ?,?)
        `;
        db.run(sql, [userId, username, title, content, countryName, dateOfVisit], function (err) {
            if (err) {
                return callback(err); 
            }
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
    static deletePost(postId, callback) {
        const sql = `DELETE FROM blog WHERE id = ?`;
        db.run(sql, [postId], function (err) {
            if (err) {
                return callback(err);
            }
            callback(null, this.changes);
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

    static getAllPosts({ currentUserId = 0, sortBy = 'newest' } = {}) {
        let orderClause;
        if (sortBy === 'mostLiked') {
            orderClause = 'ORDER BY counts.likes DESC, b.created_at DESC';
        } else {
            orderClause = 'ORDER BY b.created_at DESC';
        }

        const sql = `
          SELECT
            b.id,
            b.title,
            b.content,
            b.user_id,
            u.username   AS user_name,
            b.date_of_visit,
            b.country_name,
            COALESCE(counts.likes,    0) AS likes,
            COALESCE(counts.dislikes, 0) AS dislikes,
            CASE WHEN EXISTS(
              SELECT 1 FROM follows f
              WHERE f.follower_id = ? AND f.following_id = b.user_id
            ) THEN 1 ELSE 0 END         AS isFollowing
          FROM blog b
          JOIN users u      ON b.user_id = u.id
          LEFT JOIN (
            SELECT
              pl.blog_id,
              SUM(CASE WHEN pl.is_like = 1 THEN 1 ELSE 0 END) AS likes,
              SUM(CASE WHEN pl.is_like = 0 THEN 1 ELSE 0 END) AS dislikes
            FROM post_likes pl
            GROUP BY pl.blog_id
          ) AS counts
            ON counts.blog_id = b.id
          ${orderClause}
        `;

        return new Promise((resolve, reject) => {
            db.all(sql, [currentUserId], (err, rows) => {
                if (err) return reject(err);
                resolve(rows);
            });
        });
    }
}

module.exports = BlogDao;