const router = require("express").Router();
const passport = require("passport");

const {
  postBlogValidator,
  commentValidator,
  validate,
} = require("../helpers/validationAndSanitization");
const blogController = require("../Controllers/blogController");
const commentController = require("../Controllers/commentController");

router.get("/", blogController.getBlogs);

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  postBlogValidator(),
  validate,
  blogController.postBlog
);

router.get("/blog/:blogId", blogController.getSpecificBlog);

router.put(
  "/blog/:blogId",
  passport.authenticate("jwt", { session: false }),
  postBlogValidator(),
  validate,
  blogController.updateBlog
);

router.delete(
  "/blog/:blogId",
  passport.authenticate("jwt", { session: false }),
  blogController.deleteBlog
);

router.post(
  "/blog/:blogId/comment",
  commentValidator(),
  validate,
  commentController.postComment
);

router.delete(
  "/blog/:blogId/comment/:commentId",
  passport.authenticate("jwt", { session: false }),
  commentController.deleteComment
);

module.exports = router;
