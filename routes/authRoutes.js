const express = require("express");
const {
  register,
  login,
  verifyEmail,
  resendVerifyEmail,
  logout,
  resetPasswordLink,
  resetPassword,
} = require("../controllers/authControllers");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.patch("/reset-password-link", resetPasswordLink);
router.patch("/reset-password", resetPassword);
router.patch("/resend-email", resendVerifyEmail);
router.get("/logout", logout);

module.exports = router;
