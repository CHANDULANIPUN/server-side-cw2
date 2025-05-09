const express = require('express');
const {
    registerUser, loginUser, getAllCountries, generateApiKey, revokeApiKey,
    createAdminUser, adminlogin, logoutUser, followUser, unfollowUser,
    getFollowers, getFollowing, getFollowingFeed, getUserById
} = require('../controllers/userController.js');
const { authenticate, isAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/countries',getAllCountries);
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/logout', logoutUser);
router.post('/admincreate', authenticate, isAdmin, createAdminUser);
router.post('/generate-api-key', authenticate, isAdmin, generateApiKey);
router.post('/revoke-api-key', authenticate, isAdmin, revokeApiKey);
router.post('/adminlogin', adminlogin);
router.post('/follow', followUser);
router.post('/unfollow', unfollowUser);

router.get('/user/:userId/followers', getFollowers);
router.get('/user/:userId/following', getFollowing);

router.get('/following-feed/:userId', getFollowingFeed);



router.get('/user/:userId', getUserById);

module.exports = router;
