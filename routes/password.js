const express = require("express");
const { getAll } = require("../controllers/password");
const { verifyRefresh, verifyAccess } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/getAll",verifyAccess,getAll)

module.exports = router;