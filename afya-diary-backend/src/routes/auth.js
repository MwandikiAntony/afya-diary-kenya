const express = require('express');
const router = express.Router();

const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');
const rateLimiter = require('../middlewares/rateLimiter');

// Public: request OTP (with rate limiter)
router.post('/request-otp', rateLimiter, authController.requestOtp);
router.post("/resend-otp", authController.resendOtp);

// Public: verify OTP -> returns JWT and user
router.post('/verify-login-otp', authController.verifyLoginOtp);
router.post('/verify-registration-otp', authController.verifyRegistrationOtp);

// Protected: set PIN 
router.post('/set-pin', authMiddleware, authController.setPin);

// Public: login with PIN
router.post('/login-pin', authController.loginWithPin);

module.exports = router;
