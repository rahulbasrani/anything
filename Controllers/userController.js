const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const User = require("../Models/User");
const Blog = require("../Models/Blogs");

exports.getUser = async (req, res, next) => {
  if (!mongoose.isValidObjectId(req.params.userId)) {
    return res.status(422).json({
      error: "Enter a valid User ID",
    });
  }
  try {
    let { page, data } = req.query;
    page = +page || 1;
    data = +data || undefined;
    const user = await User.find({ _id: req.params.userId }).select(
      "-password"
    );
    if (!user) return res.json({ error: "No user found" });
    const blog = await Blog.find({ author: user[0]._id })
      .populate("comments")
      .select("-author")
      .sort({ createdAt: -1 })
      .skip((page - 1) * data)
      .limit(data);
    res.status(200).json({
      user: user[0],
      blogs: blog,
    });
  } catch (err) {
    next(err);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res.status(404).json({ error: "Invalid username or password" });
    const result = bcrypt.compare(req.body.password, user.password);
    if (!result)
      return res.status(404).json({ error: "Invalid username or password" });
    const payload = {
      id: user._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 172800000,
        secure: process.env.NODE_ENV === "PRODUCTION" ? false : true,
        sameSite: "None",
      })
      .json({
        user: {
          _id: user._id,
          username: user.username,
        },
        token: token,
      });
  } catch (err) {
    next(err);
  }
};

exports.postSignup = async (req, res, next) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 16);

    const user = new User({
      username: req.body.username,
      password: hashedPassword,
    });

    const dbUser = await user.save();

    const payload = {
      id: dbUser._id,
    };
    const token = jwt.sign(payload, process.env.SECRET, {
      expiresIn: "1d",
    });

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        maxAge: 172800000,
        secure: process.env.NODE_ENV === "PRODUCTION" ? false : true,
        sameSite: "None",
      })
      .json({
        user: {
          _id: dbUser._id,
          username: dbUser.username,
        },
        token: token,
      });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(409).json({
        error: "Username already present",
      });
    }
    next(err);
  }
};

exports.getLogout = (req, res, next) => {
  res.clearCookie("token", {
    secure: process.env.NODE_ENV === "PRODUCTION" ? false : true,
    sameSite: "None",
  });
  return res.status(200).json({
    message: "Logged Out",
  });
};

exports.validate = (req, res, next) => {
  res.status(200).json({
    authorized: true,
  });
};
