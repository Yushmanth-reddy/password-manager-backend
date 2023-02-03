const express = require("express");
const { addPass } = require("../controllers/password");
const { verifyRefresh, verifyAccess } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/addPass",verifyAccess,addPass)

module.exports = router;