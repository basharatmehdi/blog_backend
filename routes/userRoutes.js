const express = require("express");
const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/authentication");
const { getAllUsers } = require("../controllers/userControllers");
const router = express.Router();

router.get("/", authenticateUser, authorizeUser("admin"), getAllUsers);

module.exports = router;
