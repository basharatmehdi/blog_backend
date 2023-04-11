const express = require("express");
const {
  register,
  login,
  verifyEmail,
  resendVerifyEmail,
  logout,
} = require("../controllers/authControllers");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/verify-email", verifyEmail);
router.patch("/resend-email", resendVerifyEmail);
router.get("/logout", logout);

module.exports = router;
