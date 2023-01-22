const express = require("express");
const { signup, signin } = require("../controllers/auth");
const {body,validationResult} = require('express-validator')
const router = express.Router();

router.post("/signup",body("email").isEmail().withMessage("Enter a valid email"),body("password").isLength({min : 6}).withMessage("Enter a password with minimun of 6 charecters"),signup)
router.post("/refresh-token",)
router.get("/signin",signin)

module.exports = router