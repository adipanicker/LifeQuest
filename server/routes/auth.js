const express = require("express");
const router = express.Router();
const {
  register,
  login,
  getMe,
  forgotPassword,
  resetPassword,
  completeOnboarding,
} = require("../controllers/authController");
const authMiddleware = require("../middleware/auth");

//TODO: add forgot password route later
router.post("/register", register);
router.post("/login", login);
router.get("/me", authMiddleware, getMe);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.patch("/onboarding", authMiddleware, completeOnboarding);

module.exports = router;
