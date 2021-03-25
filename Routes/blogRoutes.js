const router = require("express").Router();
const passport = require("passport");

const {
  postBlogValidator,
  commentValidator,
  validate,
} = require("../helpers/validationAndSanitization");
const blogController = require("../Controllers/blogController");
const commentController = require("../Controllers/commentController");

// GET /blogs/
router.get("/", blogController.getBlogs);

// POST /blogs/
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postBlogValidator(),
  validate,
  blogController.postBlog
);

// GET /blogs/blog/:blogId
router.get("/blog/:blogId", blogController.getSpecificBlog);

// PUT /blogs/blog/:blogId
router.put(
  "/blog/:blogId",
  passport.authenticate("jwt", { session: false }),
  postBlogValidator(),
  validate,
  blogController.updateBlog
);

// DELETE /blogs/blog/:blogId
router.delete(
  "/blog/:blogId",
  passport.authenticate("jwt", { session: false }),
  blogController.deleteBlog
);

// POST /blogs/blog/:blogId/comment
router.post(
  "/blog/:blogId/comment",
  commentValidator(),
  validate,
  commentController.postComment
);

// DELETE /blogs/blog/:blogId/comment/:commetId
router.delete(
  "/blog/:blogId/comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

module.exports = router;
