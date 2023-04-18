const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
} = require("../controllers/postControllers");
const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/authentication");

router.post(
  "/create-post",
  authenticateUser,
  authorizeUser("admin", "author"),
  createPost
);
router.get("/", getAllPosts);
router.patch("/update-post/:id", authenticateUser, updatePost);
router.delete("/delete-post/:id", authenticateUser, deletePost);
router.get("/:id", getSinglePost);

module.exports = router;
