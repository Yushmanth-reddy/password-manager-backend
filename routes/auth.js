// importing
const express = require("express");
const { signup, signin, logout } = require("../controllers/auth");
const { body, validationResult } = require("express-validator");
const router = express.Router();

// submitting data to a specific resource to be processed

router.post(
  "/signup",
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Enter a password with minimun of 6 charecters"),
  signup
);
// router.post("/refresh-token",)
router.post(
  "/signin",
  body("email").isEmail().withMessage("Enter a valid email"),
  body("password")
    .isLength({ min: 6 })
    .withMessage("Enter a password with minimun of 6 charecters"),
  signin
);
// router.get("/signin",signin)

router.delete('/logout', logout)

module.exports = router;
