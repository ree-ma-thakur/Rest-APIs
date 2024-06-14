const { validationResult } = require("express-validator");
const Post = require("../models/posts");

exports.getPosts = (req, res, next) => {
  Post.find()
    .then((posts) => {
      //  200 for success
      res.status(200).json({
        message: "Fetched data succesfully",
        posts,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // async code
    });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    throw error; // it will now try to reach next error handling function in application : sync code
  }
  if (!req.file) {
    console.log("here");
    const error = new Error("No image");
    error.statusCode = 422;
    throw error;
  }
  const imageUrl = req.file.path;
  const title = req.body.title;
  const content = req.body.content;
  const post = new Post({
    title: title,
    content: content,
    imageUrl: imageUrl,
    creator: { name: "Reema" },
  });
  post
    .save()
    .then((result) => {
      // 201 for resource creation
      res.status(201).json({
        message: "Post created successfully!",
        post: result,
      });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // async code
    });
};

exports.getPost = (req, res, next) => {
  const postId = req.params.postId;
  Post.findById(postId)
    .then((post) => {
      if (!post) {
        const error = new Error("Could not find post");
        error.statusCode = 404; // not found
        throw error; // inside async, so it will get caught in catch block
      }
      res.status(200).json({ message: "Post fetched.", post });
    })
    .catch((err) => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err); // async code
    });
};
