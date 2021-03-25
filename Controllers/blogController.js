const mongoose = require("mongoose");
const Blogs = require("../Models/Blogs");

const Blog = require("../Models/Blogs");

exports.getBlogs = async (req, res, next) => {
  let { page, data } = req.query;
  page = +page || 1;
  data = +data || undefined;
  try {
    const blogs = await Blog.find({ isPublic: true })
      .populate("author", ["_id", "username"])
      .populate("comments")
      .sort({ createdAt: -1 })
      .skip((page - 1) * data)
      .limit(data);
    const numberOfBlogs = await Blogs.countDocuments();
    if (blogs.length === 0) return res.status(200).json({ blogs: blogs });
    return res.status(200).json({
      totalBlogs: numberOfBlogs,
      blogs: blogs,
    });
  } catch (err) {
    next(err);
  }
};

exports.postBlog = async (req, res, next) => {
  const { title, summary, post, public } = req.body;
  try {
    const blog = new Blog({
      title: title,
      summary: summary,
      post: post,
      isPublic: public,
      author: req.user._id,
      comments: [],
    });
    const blogDb = await blog.save();
    res.status(200).json({
      success: true,
      message: "Blog saved to the database",
      blog: blogDb,
    });
  } catch (err) {
    next(err);
  }
};

exports.getSpecificBlog = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.blogId)) {
    return res.status(422).json({
      error: "Enter a valid Blog ID",
    });
  }
  try {
    const blog = await Blog.find({ _id: req.params.blogId })
      .populate("author", ["_id", "username"])
      .populate("comments");
    if (blog.length === 0)
      return res.status(404).json({ error: "No blogs found" });
    return res.status(200).json({
      blog: blog[0],
    });
  } catch (err) {
    next(err);
  }
};

exports.updateBlog = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.blogId)) {
    return res.status(422).json({
      error: "Enter a valid Blog ID",
    });
  }
  const { title, summary, post, public } = req.body;
  try {
    const blog = await Blog.find({
      _id: req.params.blogId,
    });
    if (blog.length === 0)
      return res.status(404).json({ error: "No blogs found" });
    if (blog[0].author.toString() !== req.user._id.toString()) {
      return res
        .status(422)
        .json({ error: "You are not the author of the blog" });
    }
    blog[0].title = title;
    blog[0].summary = summary;
    blog[0].post = post;
    blog[0].isPublic = public;
    const updatedBlog = await blog[0].save();
    return res.status(200).json({
      message: "Blog Update",
      blog: updatedBlog,
    });
  } catch (err) {
    next(err);
  }
};

exports.deleteBlog = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.blogId)) {
    return res.status(422).json({
      error: "Enter a valid Blog ID",
    });
  }
  try {
    const blog = await Blog.find({ _id: req.params.blogId }).populate(
      "author",
      ["_id", "username"]
    );
    if (blog.length === 0)
      return res.status(404).json({ error: "No blogs found" });
    if (blog[0].author._id.toString() !== req.user._id.toString()) {
      return res
        .status(422)
        .json({ error: "You are not the author of the blog" });
    }
    const deletedBlog = await blog[0].delete();
    return res.status(200).json({
      message: "Blog deleted successfully",
      blog: blog[0],
    });
  } catch (err) {
    next(err);
  }
};
