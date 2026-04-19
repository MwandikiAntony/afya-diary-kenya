const jwt = require('jsonwebtoken');
const User = require('../models/User');

const DEMO_MODE = true;

const authMiddleware = async (req, res, next) => {
  try {
    // Demo mode bypass
    if (DEMO_MODE) {
      req.user = {
        _id: 'demo-user-id',
        name: 'Demo User',
        email: 'demo@afyadiary.com',
        role: 'patient',
      };

      return next();
    }

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: 'Authorization header required' });
    }

    const [scheme, token] = authHeader.split(' ');

    if (scheme !== 'Bearer' || !token) {
      return res.status(401).json({ message: 'Invalid authorization format' });
    }

    let payload;

    try {
      payload = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    const user = await User.findById(payload.userId).select('-passwordHash');

    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('authMiddleware error', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = authMiddleware;