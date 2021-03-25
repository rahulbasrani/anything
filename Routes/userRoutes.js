const router = require("express").Router();
const passport = require("passport");

const {
  userLoginValidator,
  userSignupValidator,
  validate,
} = require("../helpers/validationAndSanitization");
const userController = require("../Controllers/userController");

// GET /logout
router.get("/logout", userController.getLogout);

// GET /check
router.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  userController.validate
);

// GET /user/:userId
router.get("/:userId", userController.getUser);

// POST /user/signup
router.post(
  "/signup",
  userSignupValidator(),
  validate,
  userController.postSignup
);

// POST /user/login
router.post("/login", userLoginValidator(), validate, userController.postLogin);

module.exports = router;
