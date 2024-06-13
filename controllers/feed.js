const { validationResult } = require("express-validator");

exports.getPosts = (req, res, next) => {
  //  200 for success
  res.status(200).json({
    posts: [
      {
        _id: 1,
        title: "First Post",
        content: "This is the content",
        imageUrl: "images/download.jpg",
        creator: { name: "Reema" },
        createdAt: new Date(),
      },
    ],
  });
};

exports.createPost = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res
      .status(422)
      .json({ message: "Validation failed", errors: errors.array() });
  }
  const title = req.body.title;
  const content = req.body.content;
  // Create response in DB
  // 201 is for resource created
  console.log(title, content);
  res.status(201).json({
    message: "Post created successfully!",
    post: {
      _id: Date.now(),
      title: title,
      content: content,
      creator: { name: "Reema" },
      createdAt: new Date(),
    },
  });
};
