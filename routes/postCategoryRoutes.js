const express = require("express");
const router = express.Router();
const {
  authenticateUser,
  authorizeUser,
} = require("../middlewares/authentication");
const {
  createPostCategory,
  getAllPostCategories,
  updatePostCategory,
  deletePostCategory,
  getSinglePostCategory,
} = require("../controllers/postCatControllers");

router.post("/create-post-category", authenticateUser, createPostCategory);
router.get("/", getAllPostCategories);
router.get("/:id", getSinglePostCategory);
router.patch("/update-category/:id", authenticateUser, updatePostCategory);
router.delete("/delete-category/:id", authenticateUser, deletePostCategory);

module.exports = router;
