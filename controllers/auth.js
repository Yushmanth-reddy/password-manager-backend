const User = require("../models/user");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const client = require("../configs/redis");
const NodeRSA = require("node-rsa");
const nodemailer = require("nodemailer");
const { createError } = require("../utils/error");
const key = new NodeRSA({ b: 1024 });
const URL = "http://localhost:3300";

// generating accessToken
const accessTokenGenerator = (user) => {
  const payload = {};
  const options = {
    expiresIn: "1h",
    audience: [user._id],
  };
  var accessToken = jwt.sign(payload, process.env.JWT_ACCESS_KEY, options);

  return accessToken;
};

// generating refreshToken
const refreshTokenGenerator = (user) => {
  const payload = {};
  const options = {
    expiresIn: "1y",
    audience: [user._id],
  };
  var refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_KEY, options);
  const userId = user._id.toString();

  return refreshToken;
};

// signup function
exports.signup = async (req, res, next) => {
  const { email, name, password } = req.body;
  try {
    const validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) {
      const isExist = await User.findOne({ email: email });
      if (isExist) return next(createError(400, "user already exists"));

      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(password, salt);

      const publicKey = key.exportKey("public");
      const privateKey = key.exportKey("private");
      const user = new User({
        email,
        name,
        password: hash,
        publicKey,
      });

      await user.save();
      const accessToken = accessTokenGenerator(user);
      const refreshToken = refreshTokenGenerator(user);

      res.cookie("refreshToken", refreshToken, {
        expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });

      res.status(200).json({ accessToken, refreshToken, privateKey });
    } else {
      return next(
        createError(
          400,
          validationErrors.array().map((err) => ({ msg: err.msg }))
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

// signing in the user
exports.signin = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const validationErrors = validationResult(req);
    if (validationErrors.isEmpty()) {
      const isExist = await User.findOne({ email: email });
      if (!isExist) return next(createError(404, "user doesnot exists"));
      //if user exist than compare password
      //password comes from the user
      //user.password comes from the database

      const passCorrect = await bcrypt.compare(password, isExist.password);
      if (!passCorrect)
        return next(createError(400, "User or password not correct"));

      const accessToken = accessTokenGenerator(isExist);
      const refreshToken = refreshTokenGenerator(isExist);
      res.cookie("refreshToken", refreshToken, {
        expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
        httpOnly: true,
      });
      res.json({ accessToken, refreshToken });
    } else {
      return next(
        createError(
          400,
          validationErrors.array().map((err) => ({ msg: err.msg }))
        )
      );
    }
  } catch (err) {
    next(err);
  }
};

// exporting Access Token and Refresh Token
exports.refreshToken = async (req, res, next) => {
  try {
    const user = req.user;

    const accessToken = accessTokenGenerator(user);
    const refreshToken = refreshTokenGenerator(user);

    res.cookie("refreshToken", refreshToken, {
      expires: new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    });
    res.status(200).json({ accessToken, refreshToken });
  } catch (err) {
    next(err);
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const isExist = await User.findOne({ email: email });
    if (!isExist) {
      res.json({ message: "User does not exist" });
      return;
    }
    const secret = process.env.JWT_ACCESS_KEY + isExist.password;

    const token = jwt.sign({ email: isExist.email, id: isExist._id }, secret, {
      expiresIn: "5m",
    });
    const link = `${URL}/auth/reset-password/${isExist._id}/${token}`;
    var nodemailer = require("nodemailer");

    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "yushmurdy29@gmail.com",
        pass: "xlsadgjvmsuujmwb",
      },
    });

    var mailOptions = {
      from: "yushmurdy29@gmail.com",
      to: "yushmanthponnolu@gmail.com",
      subject: "Sending Email using Node.js",
      text: link,
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    console.log(link);
  } catch (err) {
    console.log(err);
  }
};

exports.resetPassword = async (req, res) => {
  const { id, token } = req.params;
  const { password } = req.body;
  const isExist = await User.findOne({ _id: id });
  if (!isExist) {
    res.json({ message: "User does not exist" });
    return;
  }
  const secret = process.env.JWT_ACCESS_KEY + isExist.password;
  try {
    const verify = jwt.verify(token, secret);
    const hashedPassword = await bcrypt.hash(password, 10);
    await User.updateOne(
      {
        _id: id,
      },
      {
        $set: {
          password: hashedPassword,
        },
      }
    );
    res.status(200).json({ message: "password updated" });
  } catch (err) {
    res.send("not verified");
  }
};
