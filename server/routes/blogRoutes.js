const express = require('express');
const { createPost, updatePost, deletePost, getAllPosts, getPostById, searchPosts,likePost,dislikePost,getPostsByUser } = require('../controllers/blogController.js');

const router = express.Router();

// Route to create a new blog post
router.post('/posts', createPost);

// Route to update an existing blog post
router.put('/posts/:id', updatePost);

// Route to delete a blog post
router.delete('/posts/:id', deletePost);

// Route to get all blog posts
router.get('/posts', getAllPosts);

// Route to get a single blog post by ID
router.get('/posts/:id', getPostById);

router.get('/search', searchPosts);

router.post('/posts/:id/like', likePost);

router.post('/posts/:id/dislike', dislikePost);

router.get('/posts/user/:username', getPostsByUser);


module.exports = router;