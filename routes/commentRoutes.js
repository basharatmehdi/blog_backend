const express = require("express");
const {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
} = require("../controllers/commentControllers");
const { authenticateUser } = require("../middlewares/authentication");
const router = express.Router();

router.post("/create-comment", authenticateUser, createComment);
router.get("/", getAllComments);
router.patch("/update-comment/:id", authenticateUser, updateComment);
router.delete("/delete-comment/:id", authenticateUser, deleteComment);

module.exports = router;
