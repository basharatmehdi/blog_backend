const Comment = require("../models/Comment");
const CustomErrors = require("../errors");
const StatusCodes = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");

// Create Comment
const createComment = async (req, res) => {
  const { commentText, postId } = req.body;
  if (!commentText || !postId) {
    throw new CustomErrors.BadRequestError(
      "All fields are required to create a comment"
    );
  }
  const user = req.user;
  const comment = await Comment.create({
    commentText,
    user: user.userId,
    post: postId,
  });
  res.status(StatusCodes.CREATED).json({ comment });
};

//Get All Comments
const getAllComments = async (req, res) => {
  const comments = await Comment.find({})
    .populate({
      path: "user post",
      select: "-password",
    })
    .sort({ createdAt: -1 });
  if (!comments) {
    throw new CustomErrors.NotFoundError("No comments found");
  }
  res.status(StatusCodes.OK).json({ totalComments: comments.length, comments });
};

//Update Comment
const updateComment = async (req, res) => {
  const { id: commentId } = req.params;
  const { commentText } = req.body;
  if (!commentText) {
    throw new CustomErrors.BadRequestError("Please provide commentText");
  }
  const user = req.user;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new CustomErrors.NotFoundError("Comment not found");
  }
  checkPermissions({ reqUser: user, sourceUserId: comment.user });
  comment.commentText = commentText;
  await comment.save();
  res
    .status(StatusCodes.OK)
    .json({ msg: "Comment updated successfully", comment });
};

//Delete Comment
const deleteComment = async (req, res) => {
  const { id: commentId } = req.params;
  const user = req.user;
  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new CustomErrors.NotFoundError("Comment not found");
  }
  checkPermissions({ reqUser: user, sourceUserId: comment.user });
  await comment.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Comment deleted successfully" });
};

module.exports = {
  createComment,
  getAllComments,
  updateComment,
  deleteComment,
};
