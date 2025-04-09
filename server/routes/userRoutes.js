// In your userRoutes.js
const express = require('express');
const { registerUser , loginUser , getCountryData, generateApiKey, revokeApiKey } = require('../controllers/userController.js');
const authenticate = require('../middleware/authMiddleware'); 

const router = express.Router();

// Route to get country data, protected by authentication middleware
router.get('/countries/:name', authenticate, getCountryData);

// Route to register a new user
router.post('/register', registerUser );

// Route to log in a user
router.post('/login', loginUser );

router.post('/generate-api-key',  generateApiKey);

router.post('/revoke-api-key', revokeApiKey);

module.exports = router;