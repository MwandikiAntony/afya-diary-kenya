const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');

// Public: request OTP (with rate limiter)
router.post('/request-otp', rateLimiter, authController.requestOtp);

// Public: verify OTP -> returns JWT and user
router.post('/verify-otp', authController.verifyOtp);

// Protected: set PIN (optional)
router.post('/set-pin', authMiddleware, authController.setPin);

// Public: login with PIN
router.post('/login-pin', authController.loginWithPin);

module.exports = router;
