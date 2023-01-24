// imports
const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const redisClient = require("../init_redis");
// function to generate an access token

const accessTokenGenerator = (user) => {
  const payload = {};
  const options = {
    expiresIn: "1h",
    audience: [user._id],
  };
  var accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, options);

  return accessToken;
};

// function to generate a refresh token

const refreshTokenGenerator = (user) => {
  const payload = {};
  const options = {
    expiresIn: "1y",
    audience: [user._id],
  };
  var refreshToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, options);

  return refreshToken;
};

// signup function

exports.signup = async (req, res) => {
  const { email, name, password } = req.body;

  // checking for possible validation errors

  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    // checking if the user exists in the database
    const isExist = await User.findOne({ email: email });

    if (isExist) {
      res.json({
        message: "user already exists",
      });
    } else {
      // hashing the password
      bcrypt.hash(password, 10, async (err, hash) => {
        if (err) {
          res.json({
            msg: "err in hashing password",
          });
        } else {
          // creating a new user
          const user = new User({
            email,
            name,
            password: hash,
          });
          // saving the user in the databaase
          await user.save();
          // creating an accessToken
          const accessToken = accessTokenGenerator();
          // creating a refreshToken
          const refreshToken = refreshTokenGenerator();

          res.json({ accessToken, refreshToken });
        }
      });
    }
  } else {
    const errors = validationErrors.array().map((err) => {
      return {
        msg: err.msg,
      };
    });
    res.json({
      errors,
    });
  }
};
// signin function
exports.signin = async (req, res) => {
  const { email, password } = req.body;
  const validationErrors = validationResult(req);
  if (validationErrors.isEmpty()) {
    const isExist = await User.findOne({ email: email });
    console.log(isExist);
    if (!isExist) {
      res.json({ message: "User does not exist" });
    }
    //if user exist than compare password
    //password comes from the user
    //user.password comes from the database
    else {
      bcrypt.compare(password, isExist.password, (err, data) => {
        if (err) {
          res.json({
            msg: "err in hashing password",
          });
        } else {
          const accessToken = accessTokenGenerator(isExist);
          const refreshToken = refreshTokenGenerator(isExist);
          res.json({ accessToken, refreshToken });
        }
      });
    }
  }
};

exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw createError.BadRequest();
    }
    const userID = await refreshToken(refreshToken);
    redisClient.DEL(userID, (err, val) => {
      if (err) {
        console.log(err.message);
        throw createError.InternalServerError();
      }
      console.log(val);
    });
  } catch (error) {
    next(error);
  }
};
