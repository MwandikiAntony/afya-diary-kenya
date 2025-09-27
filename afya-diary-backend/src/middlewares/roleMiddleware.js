// src/middlewares/roleMiddleware.js
module.exports = function (roles = []) {
  return (req, res, next) => {
    // roles array empty = allow all authenticated users
    if (roles.length && !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied: insufficient permissions" });
    }
    next();
  };
};
