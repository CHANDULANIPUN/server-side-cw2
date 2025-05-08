const BlogDao = require('../dao/blogDao');

exports.createPost = async (req, res) => {
    const { username, title, content, countryName, dateOfVisit } = req.body;

    if (!username || !title || !content || !countryName || !dateOfVisit) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const postId = await new Promise((resolve, reject) => {
            BlogDao.createPost(username, title, content, countryName, dateOfVisit, (err, postId) => {
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
    const { username, title, content, countryName, dateOfVisit } = req.body;

    if (!username || !title || !content || !countryName || !dateOfVisit) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const changes = await new Promise((resolve, reject) => {
            BlogDao.updatePost(postId, username, title, content, countryName, dateOfVisit, (err, changes) => {
                if (err) return reject(err);
                resolve(changes);
            });
        });

        if (changes === 0) {
            return res.status(404).json({ error: 'Post not found or not authorized' });
        }

        res.status(200).json({ message: 'Post updated' });
    } catch (error) {
        console.error('Error updating post:', error);
        res.status(500).json({ error: 'Failed to update post' });
    }
};

exports.deletePost = async (req, res) => {
    const postId = req.params.id;
    const { username } = req.body;

    if (!username) {
        return res.status(400).json({ error: 'User name is required' });
    }

    try {
        const changes = await new Promise((resolve, reject) => {
            BlogDao.deletePost(postId, username, (err, changes) => {
                if (err) return reject(err);
                resolve(changes);
            });
        });

        if (changes === 0) {
            return res.status(404).json({ error: 'Post not found or not authorized' });
        }

        res.status(200).json({ message: 'Post deleted' });
    } catch (error) {
        console.error('Error deleting post:', error);
        res.status(500).json({ error: 'Failed to delete post' });
    }
};

exports.getAllPosts = async (req, res) => {
    try {
        const posts = await new Promise((resolve, reject) => {
            BlogDao.getAllPosts((err, posts) => {
                if (err) return reject(err);
                resolve(posts);
            });
        });

        res.status(200).json(posts);
    } catch (error) {
        console.error('Error retrieving posts:', error);
        res.status(500).json({ error: 'Failed to retrieve posts' });
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
    const { countryName, username, page = 1, limit = 10 } = req.query;

    try {
        const result = await new Promise((resolve, reject) => {
            BlogDao.searchPosts(countryName, username, page, limit, (err, data) => {
                if (err) return reject(err);
                resolve(data);
            });
        });

        res.status(200).json({
            message: 'Search successful',
            posts: result.posts,
            total: result.total,
            page: parseInt(page),
            totalPages: Math.ceil(result.total / limit)
        });
    } catch (error) {
        console.error('Error searching posts:', error);
        res.status(500).json({ error: 'Failed to search posts' });
    }
};
