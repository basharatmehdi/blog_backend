const express = require("express");
const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/authentication");
const {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
  deleteUser,
  updateUserPassword,
  updateUserRole,
} = require("../controllers/userControllers");
const router = express.Router();

router.get("/", authenticateUser, authorizeUser("admin"), getAllUsers);
router.get("/show-me", authenticateUser, showCurrentUser);
router.patch("/update-user", authenticateUser, updateUser);
router.patch("/update-password", authenticateUser, updateUserPassword);
router.patch(
  "/update-user-role/:id",
  authenticateUser,
  authorizeUser("admin", "owner"),
  updateUserRole
);
router.delete("/delete-user/:id", authenticateUser, deleteUser);
router.get("/:id", authenticateUser, getSingleUser);

module.exports = router;
