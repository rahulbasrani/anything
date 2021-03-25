const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const JwtStratery = require("passport-jwt").Strategy;
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();

const User = require("./models/user");

const blogRoutes = require("./Routes/blogRoutes");
const userRoutes = require("./Routes/userRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["token"];
  }
  return token;
};

passport.use(
  new JwtStratery(
    {
      secretOrKey: "mynameisvinodbahadurthatpayoutuber",
      jwtFromRequest: cookieExtractor,
      jsonWebTokenOptions: {
        maxAge: "2d",
      },
    },
    async (jwt_payload, done) => {
      try {
        const user = await User.findOne({ _id: jwt_payload.id });
        if (user) {
          return done(null, user);
        } else {
          return done(null, false, { message: "User authentication failed" });
        }
      } catch (err) {
        return done(err, false, { message: "User authentication failed" });
      }
    }
  )
);

app.use(passport.initialize());

app.get("/", (req, res, next) => {
  res.json({
    message: "Welcome to the Blog API",
  });
});

app.use("/blogs", blogRoutes);
app.use("/user", userRoutes);

app.use((req, res, next) => {
  res.status(400).json({
    message: "Invalid Route",
  });
});

app.use((err, req, res, next) => {
  res.status(500).json({
    error: err.message,
  });
});

mongoose.connect("mongodb+srv://rahul:rahul@rb.icbpz.mongodb.net/blog-api?retryWrites=true&w=majority", {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
const connection = mongoose.connection;
connection.on("error", console.error.bind(console, "Error Connecting to DB."));

app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
