const mongoose = require("mongoose");

const Comment = require("../Models/Comments");
const Blog = require("../Models/Blogs");

exports.postComment = async (req, res, next) => {
  const blogId = req.params.blogId;
  if (!mongoose.isValidObjectId(blogId)) {
    return res.json({
      error: "Enter a valid Blog ID",
    });
  }

  try {
    const { username, comment } = req.body;
    let blog = await Blog.find({ _id: blogId });
    if (blog.length === 0) return res.json({ error: "No blogs found" });

    blog = blog[0];
    const newComment = new Comment({
      username: username,
      comment: comment,
    });
    const savedComment = await newComment.save();

    blog.comments.push(savedComment._id);
    const savedBlog = await blog.save();

    res.status(200).json({
      success: true,
      message: "commented",
      comment: savedComment,
    });
  } catch (err) {
    return next(err);
  }
};

exports.deleteComment = async (req, res, next) => {
  const { blogId, commentId } = req.params;
  if (!mongoose.isValidObjectId(blogId)) {
    return res.json({
      error: "Enter a valid Blog ID",
    });
  }
  if (!mongoose.isValidObjectId(commentId)) {
    return res.json({
      error: "Enter a valid Comment ID",
    });
  }
  try {
    let blog = await Blog.find({ _id: blogId });
    if (blog.length === 0) return res.json({ error: "No blogs found" });

    blog = blog[0];
    if (blog.author.toString() !== req.user._id.toString()) {
      return res.status(422).json({
        error: "Cannot delete comment as you are not the author of the blog",
      });
    }
    let deletedComment = await Comment.findOneAndDelete({ _id: commentId });

    await blog.comments.pull(commentId);
    const savedBlog = await blog.save();

    res.status(200).json({
      success: true,
      message: "comment deleted",
      comment: deletedComment,
    });
  } catch (err) {
    return next(err);
  }
};
