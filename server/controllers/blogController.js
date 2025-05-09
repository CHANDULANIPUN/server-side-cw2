const BlogDao = require('../dao/blogDao');

exports.createPost = async (req, res) => {
    const { userId, username, title, content, countryName, dateOfVisit } = req.body;

    if (!userId || !username || !title || !content || !countryName || !dateOfVisit) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const postId = await new Promise((resolve, reject) => {
            BlogDao.createPost(userId, username, title, content, countryName, dateOfVisit, (err, postId) => {
                if (err) return reject(err);
                resolve(postId);
            });
        });

        res.status(201).json({ message: 'Post created', postId });
    } catch (error) {
        console.error('Error creating post:', error);
        res.status(500).json({ error: 'Failed to create post' });
    }
};

exports.updatePost = async (req, res) => {
    const postId = req.params.id;
    const { title, content, country_name, date_of_visit } = req.body;

    if (!title || !content || !country_name || !date_of_visit) {
        return res.status(400).json({ error: 'All fields are required.' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            BlogDao.updatePost(postId, title, content, country_name, date_of_visit, (err, changes) => {
                if (err) return reject(err);
                resolve(changes);
            });
        });

        if (result === 0) {
            return res.status(404).json({ error: 'Post not found or could not be updated.' });
        }

        return res.status(200).json({ message: 'Post updated successfully.' });
    } catch (error) {
        console.error(`Error updating post with ID ${postId}:`, error);
        return res.status(500).json({ error: 'Internal server error.' });
    }
};


exports.deletePost = async (req, res) => {
    const postId = req.params.id;

    try {
        const result = await new Promise((resolve, reject) => {
            BlogDao.deletePost(postId, (err, changes) => {
                if (err) return reject(err);
                resolve(changes);
            });
        });

        if (result === 0) {
            return res.status(404).json({
                error: 'Post not found or could not be deleted.',
            });
        }

        return res.status(200).json({ message: 'Post successfully deleted.' });
    } catch (error) {
        console.error(`Error deleting post with ID ${postId}:`, error);
        return res.status(500).json({
            error: 'An internal server error occurred while deleting the post.',
        });
    }
};


exports.getAllPosts = async (req, res) => {
    try {
        const currentUserId = Number(req.query.currentUserId);

        const posts = await new Promise((resolve, reject) => {
            BlogDao.getAllPosts(currentUserId, (err, posts) => {
                if (err) return reject(err);
                resolve(posts);
            });
        });

        res.status(200).json(posts || []);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Failed to retrieve posts' });
    }
};

exports.getPostsByUser = async (req, res) => {
    const username = req.params.username;

    try {
        const posts = await new Promise((resolve, reject) => {
            BlogDao.getPostsByUser(username, (err, posts) => {
                if (err) return reject(err);
                resolve(posts);
            });
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error retrieving user posts:', error);
        res.status(500).json({ error: 'Failed to retrieve user posts' });
    }
};


exports.getPostById = async (req, res) => {
    const postId = req.params.id;

    try {
        const post = await new Promise((resolve, reject) => {
            BlogDao.getPostById(postId, (err, post) => {
                if (err) return reject(err);
                resolve(post);
            });
        });

        if (!post) {
            return res.status(404).json({ error: 'Post not found' });
        }

        res.status(200).json(post);
    } catch (error) {
        console.error('Error retrieving post:', error);
        res.status(500).json({ error: 'Failed to retrieve post' });
    }
};

exports.searchPosts = async (req, res) => {
    const { query, page = 1, limit = 10 } = req.query;

    if (!query) {
        return res.status(400).json({ error: 'Query parameter is required' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            BlogDao.searchPosts(query, page, limit, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        res.status(200).json({
            message: 'Search successful',
            posts: result.posts,
            total: result.total,
            page: parseInt(page),
            totalPages: Math.ceil(result.total / limit),
        });
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ error: 'Failed to search posts' });
    }
};

exports.likePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            BlogDao.likePost(postId, userId, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        res.status(200).json({ message: 'Post liked', data: result });
    } catch (error) {
        console.error('Error liking post:', error);
        res.status(500).json({ error: 'Failed to like post' });
    }
};

exports.dislikePost = async (req, res) => {
    const postId = req.params.id;
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'User ID is required' });
    }

    try {
        const result = await new Promise((resolve, reject) => {
            BlogDao.dislikePost(postId, userId, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        res.status(200).json({ message: 'Post disliked', data: result });
    } catch (error) {
        console.error('Error disliking post:', error);
        res.status(500).json({ error: 'Failed to dislike post' });
    }
};

exports.getAllPostsSorted = async (req, res) => {
    const { sortBy } = req.query; // ?sortBy=newest or ?sortBy=mostLiked

    try {
        const posts = await BlogDao.getAllPostsSorted(sortBy);
        res.status(200).json(posts);
    } catch (error) {
        console.error('Error retrieving sorted posts:', error);
        res.status(500).json({ error: 'Failed to retrieve sorted posts' });
    }
};








