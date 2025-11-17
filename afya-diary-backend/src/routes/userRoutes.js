const express = require("express");
const { registerUser, loginUser, getProfile, updateProfile } = require("../controllers/userController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();


router.post("/register", registerUser);
router.post("/login", loginUser);


router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

module.exports = router;
