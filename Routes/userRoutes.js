const router = require("express").Router();
const passport = require("passport");

const {
  userLoginValidator,
  userSignupValidator,
  validate,
} = require("../helpers/validationAndSanitization");
const userController = require("../Controllers/userController");

router.get("/logout", userController.getLogout);

router.get(
  "/check",
  passport.authenticate("jwt", { session: false }),
  userController.validate
);

router.get("/:userId", userController.getUser);

router.post(
  "/signup",
  userSignupValidator(),
  validate,
  userController.postSignup
);

router.post("/login", userLoginValidator(), validate, userController.postLogin);

module.exports = router;
