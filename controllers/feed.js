const fs = require("fs");
const path = require("path");
const { validationResult } = require("express-validator");
const Post = require("../models/posts");
const User = require("../models/user");

exports.getPosts = async (req, res, next) => {
  const currentPage = req?.query?.page || 1;
  const perPage = 2;
  try {
    const totalItems = await Post.find().countDocuments();
    const posts = await Post.find()
      .populate("creator")
      .skip((currentPage - 1) * perPage)
      .limit(perPage);
    //  200 for success
    res.status(200).json({
      message: "Fetched data succesfully",
      posts,
      totalItems,
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // async code
  }
};

exports.createPost = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error; // it will now try to reach next error handling function in application : sync code
  }
  if (!req.file) {
    const error = new Error("No image");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  let creator;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: req.userId, // it is set in req in is-auth middleware
  });
  try {
    await post.save();
    const user = await User.findById(req.userId);
    user.posts.push(post);
    await user.save();
    // 201 for resource creation
    res.status(201).json({
      message: "Post created successfully!",
      post: post,
      creator: { _id: user._id, name: user.name },
    });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // async code
  }
};

exports.getPost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404; // not found
      throw error; // inside async, so it will get caught in catch block
    }
    res.status(200).json({ message: "Post fetched.", post });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // async code
  }
};

exports.updatePost = async (req, res, next) => {
  const postId = req.params.postId;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error; // it will now try to reach next error handling function in application : sync code
  }
  const title = req.body.title;
  const content = req.body.content;
  let imageUrl = req.body.image;
  if (req.file) {
    imageUrl = req.file.path;
  }
  if (!imageUrl) {
    const error = new Error("No image");
    error.statusCode = 422;
    throw error;
  }
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404; // not found
      throw error; // inside async, so it will get caught in catch block
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403; // not authorized
      throw error;
    }
    if (imageUrl !== post.imageUrl) {
      clearImage(post.imageUrl);
    }
    post.title = title;
    post.imageUrl = imageUrl;
    post.content = content;
    const result = await post.save();
    res.status(200).json({ message: "Post Updated", post: result });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // async code
  }
};

const clearImage = (filePath) => {
  filePath = path.join(__dirname, "..", filePath);
  fs.unlink(filePath, (err) => console.log(err));
};

exports.deletePost = async (req, res, next) => {
  const postId = req.params.postId;
  try {
    const post = await Post.findById(postId);
    if (!post) {
      const error = new Error("Could not find post");
      error.statusCode = 404; // not found
      throw error; // inside async, so it will get caught in catch block
    }
    if (post.creator.toString() !== req.userId) {
      const error = new Error("Not authorized");
      error.statusCode = 403; // not authorized
      throw error;
    }
    // Check user authentication
    clearImage(post.imageUrl);
    const result = await Post.findByIdAndDelete(postId);
    const user = await User.findById(req.userId);
    user.posts.pull(postId); // to remove the post that is deleted from the user
    await user.save();
    res.status(200).json({ message: "Deleted post" });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err); // async code
  }
};
