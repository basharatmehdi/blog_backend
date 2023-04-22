const express = require("express");
const router = express.Router();

const {
  createPost,
  getAllPosts,
  getSinglePost,
  updatePost,
  deletePost,
  getAllPublishedPosts,
  getAllUnpublishedPosts,
  publishPost,
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
router.patch("/publish-post/:id", authenticateUser, publishPost);
router.get(
  "/",
  authenticateUser,
  authorizeUser("admin", "author"),
  getAllPosts
);
router.get("/published", getAllPublishedPosts);
router.get(
  "/unpublished",
  authenticateUser,
  authorizeUser("admin", "author"),
  getAllUnpublishedPosts
);
router.patch("/update-post/:id", authenticateUser, updatePost);
router.delete("/delete-post/:id", authenticateUser, deletePost);
router.get("/:id", getSinglePost);

module.exports = router;
