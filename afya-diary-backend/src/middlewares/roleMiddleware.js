module.exports = function roleMiddleware(...allowed) {
  return (req, res, next) => {
    try {
      const user = req.user;
      if (!user) return res.status(401).json({ message: 'Unauthorized' });
      if (allowed.length === 0) return next();
      if (!allowed.includes(user.role)) {
        return res.status(403).json({ message: 'Forbidden: insufficient role' });
      }
      next();
    } catch (err) {
      console.error('roleMiddleware error', err);
      res.status(500).json({ message: 'Server error' });
    }
  };
};

