const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth');
const loginLimiter = require('../utils/loginLimiter');

router.post('/', loginLimiter, authController.handleLogin);

module.exports = router;
