const StatusCodes = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const CustomErrors = require("../errors");
const PostCategory = require("../models/PostCategory");

// Create PostCategory
const createPostCategory = async (req, res) => {
  const { userId } = req.user;
  const { name } = req.body;
  if (!name) {
    throw new CustomErrors.BadRequestError("Name is required");
  }
  const postCategory = await PostCategory.create({
    name,
    user: userId,
  });
  res
    .status(StatusCodes.CREATED)
    .json({ msg: "Post Category created", postCategory });
};

//Get All Categories
const getAllPostCategories = async (req, res) => {
  const postCategories = await PostCategory.find({});
  if (!postCategories) {
    throw new CustomErrors.NotFoundError("Post Categories not found");
  }
  res.status(StatusCodes.OK).json({ postCategories });
};

//Get Single Category
const getSinglePostCategory = async (req, res) => {
  const { id } = req.params;
  const postCategory = await PostCategory.findById(id);
  if (!postCategory) {
    throw new CustomErrors.NotFoundError("Post Category not found");
  }
  res.status(StatusCodes.OK).json({ postCategory });
};

//Update Category
const updatePostCategory = async (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  const category = await PostCategory.findById(id);
  checkPermissions({ reqUser: req.user, sourceUserId: category.user });
  const postCategory = await PostCategory.findByIdAndUpdate(
    id,
    { name },
    { new: true }
  );
  if (!postCategory) {
    throw new CustomErrors.NotFoundError("Post Category not found");
  }
  res.status(StatusCodes.OK).json({ msg: "Post Category updated" });
};

//Delete Category
const deletePostCategory = async (req, res) => {
  const { id } = req.params;
  const category = await PostCategory.findById(id);
  checkPermissions({ reqUser: req.user, sourceUserId: category.user });
  const postCategory = await PostCategory.findByIdAndDelete(id);
  if (!postCategory) {
    throw new CustomErrors.NotFoundError("Post Category not found");
  }
  res.status(StatusCodes.OK).json({ msg: "Post Category Deleted." });
};

module.exports = {
  createPostCategory,
  getAllPostCategories,
  getSinglePostCategory,
  updatePostCategory,
  deletePostCategory,
};
