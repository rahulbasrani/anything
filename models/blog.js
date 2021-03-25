const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    summary: {
      type: String,
      required: true,
    },
    post: {
      type: String,
      required: true,
    },
    isPublic: {
      type: Boolean,
      default: true,
    },
    author: { type: mongoose.Types.ObjectId, ref: "User", required: true },
    comments: [{ type: mongoose.Types.ObjectId, ref: "Comment" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Blog", blogSchema);
