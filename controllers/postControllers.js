const fs = require("fs");
const Post = require("../models/Post");
const CustomErrors = require("../errors");
const StatusCodes = require("http-status-codes");
const checkPermissions = require("../utils/checkPermissions");
const uploadToCloudinary = require("../utils/cloudinaryConfig");

// Create Post
const createPost = async (req, res) => {
  const { title, description, category } = req.body;
  const { image } = req.files;
  if (!image) {
    throw new CustomErrors.BadRequestError("Image is required");
  }
  const localPath = image[0].path;
  const uploadedImage = await uploadToCloudinary({
    file: localPath,
    folder: "blog/posts",
  });
  if (!title) {
    throw new CustomErrors.BadRequestError("Title is required");
  }
  if (!description) {
    throw new CustomErrors.BadRequestError("Description is required");
  }
  if (!category) {
    throw new CustomErrors.BadRequestError("Category is required");
  }
  const userId = req.user.userId;
  const post = await Post.create({
    title,
    description,
    image: uploadedImage.secure_url,
    category,
    author: userId,
  });
  fs.unlinkSync(localPath);
  res.status(StatusCodes.CREATED).json({
    post,
    msg: "Post created successfully",
  });
};

//Publish Post
const publishPost = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) {
    throw new CustomErrors.NotFoundError("Post not found");
  }
  if (post.published) {
    throw new CustomErrors.BadRequestError("Post already published");
  }
  checkPermissions({ reqUser: req.user, sourceUserId: post.author });
  post.published = true;
  await post.save();
  res.status(StatusCodes.OK).json({
    post,
    msg: "Post published successfully",
  });
};

//Get All Posts (Both)
const getAllPosts = async (req, res) => {
  const posts = await Post.find({})
    .populate({
      path: "author",
      select: "-password",
    })
    .sort({ createdAt: -1 });
  if (!posts) {
    throw new CustomErrors.NotFoundError("No posts found");
  }
  res.status(StatusCodes.OK).json({
    totalPosts: posts.length,
    posts,
  });
};

//Get All Posts (Published)
const getAllPublishedPosts = async (req, res) => {
  const posts = await Post.find({ published: true })
    .populate({
      path: "author",
      select: "-password",
    })
    .populate("comments")
    .sort({ createdAt: -1 });
  if (!posts) {
    throw new CustomErrors.NotFoundError("No posts found");
  }
  res.status(StatusCodes.OK).json({
    totalPosts: posts.length,
    posts,
  });
};

//Get All Posts (Unpublished)
const getAllUnpublishedPosts = async (req, res) => {
  const posts = await Post.find({ published: false })
    .populate({
      path: "author",
      select: "-password",
    })
    .sort({ createdAt: -1 });
  if (!posts) {
    throw new CustomErrors.NotFoundError("No posts found");
  }
  res.status(StatusCodes.OK).json({
    totalPosts: posts.length,
    posts,
  });
};

// Get Single Post
const getSinglePost = async (req, res) => {
  const { id: postId } = req.params;
  await Post.findByIdAndUpdate(
    postId,
    {
      $inc: { views: 1 },
    },
    { new: true }
  );
  const post = await Post.findById(postId)
    .populate({
      path: "author",
      select: "-password",
    })
    .populate("comments");
  if (!post) {
    throw new CustomErrors.NotFoundError("Post not found");
  }
  res.status(StatusCodes.OK).json({
    post,
  });
};

// Update Post
const updatePost = async (req, res) => {
  // const { userId } = req.user;
  const { id: postId } = req.params;
  const { title, description, category } = req.body;
  if (!title || !description || !category) {
    throw new CustomErrors.BadRequestError(
      "Title, description and category are required"
    );
  }
  const image = req.files;
  if (!image) {
    throw new CustomErrors.BadRequestError("Image is required");
  }
  const localPath = image[0].path;
  const uploadedImage = await uploadToCloudinary({
    file: localPath,
    folder: "blog/posts",
  });
  const post = await Post.findById(postId);
  if (!post) {
    throw new CustomErrors.NotFoundError("Post not found");
  }
  checkPermissions({ reqUser: req.user, sourceUserId: post.author });
  post.title = title;
  post.description = description;
  post.category = category;
  post.image = uploadedImage.secure_url;
  await post.save();
  fs.unlinkSync(localPath);
  res.status(StatusCodes.OK).json({
    post,
    msg: "Post updated successfully",
  });
};

// Delete Post
const deletePost = async (req, res) => {
  const { id: postId } = req.params;
  const post = await Post.findById(postId);
  if (!post) throw new CustomErrors.NotFoundError("Post not found");
  checkPermissions({ reqUser: req.user, sourceUserId: post.author });
  await post.deleteOne();
  res.status(StatusCodes.OK).json({
    msg: "Post deleted successfully",
  });
};

module.exports = {
  createPost,
  publishPost,
  getAllPosts,
  getAllPublishedPosts,
  getAllUnpublishedPosts,
  getSinglePost,
  updatePost,
  deletePost,
};
