const { body, validationResult } = require("express-validator");

const userSignupValidator = () => {
  return [
    body("username")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid username")
      .isAlphanumeric()
      .withMessage("Username must contain alphabet or numbers"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Minimum Password length is 6 characters"),
  ];
};

const userLoginValidator = () => {
  return [
    body("username")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid username")
      .isAlphanumeric()
      .withMessage("Username must contain alphabet or numbers"),
  ];
};

const postBlogValidator = () => {
  return [
    body("title")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Title should not be empty")
      .bail()
      .isLength({ min: 1, max: 200 })
      .withMessage(
        "Title should be atleast 1 character long and maximum of 200 characters long"
      )
      .escape(),
    body("summary")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Summary should not be empty"),
    body("post")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Post should not be empty")
      .bail()
      .isLength({ min: 1 })
      .withMessage("Post should be atleast 1 character long"),
    body("public")
      .trim()
      .not()
      .isEmpty()
      .withMessage("Public should not be empty")
      .bail()
      .isBoolean()
      .withMessage("Public must be either true or false"),
  ];
};

const commentValidator = () => {
  return [
    body("username")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please enter a valid username")
      .isAlphanumeric()
      .withMessage("Username must contain alphabet or numbers"),
    body("comment")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Comment should not be empty"),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) {
    return next();
  }

  const extractedErrors = [];
  errors.array().map((err) =>
    extractedErrors.push({
      [err.param]: err.msg,
    })
  );

  return res.status(422).json({
    errors: extractedErrors,
  });
};

module.exports = {
  userSignupValidator,
  userLoginValidator,
  postBlogValidator,
  commentValidator,
  validate,
};
