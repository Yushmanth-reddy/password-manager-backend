const express = require("express");
const {
  signup,
  signin,
  refreshToken,
  logout,
  forgotPassword,
  resetPassword,
} = require("../controllers/auth");
const { body, validationResult } = require("express-validator");
const { verifyRefresh, verifyAccess } = require("../middleware/verifyToken");
const router = express.Router();

router.post(
  "/signup",
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Enter a password with minimun of 6 charecters"),
  signup
);

router.post(
  "/signin",
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Enter a password with minimun of 6 charecters"),
  signin
);

router.post("/refresh-token", verifyRefresh, refreshToken);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password/:id/:token", resetPassword);

module.exports = router;
