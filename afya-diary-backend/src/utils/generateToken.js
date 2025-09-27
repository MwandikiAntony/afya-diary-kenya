const jwt = require("jsonwebtoken");

const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role }, // payload
    process.env.JWT_SECRET,           // secret from .env
    { expiresIn: "7d" }               // token expires in 7 days
  );
};

module.exports = generateToken;
