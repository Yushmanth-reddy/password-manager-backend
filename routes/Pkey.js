const express = require("express");
const { storePrivateKey } = require("../controllers/Pkey");
const { verifyRefresh, verifyAccess } = require("../middleware/verifyToken");
const router = express.Router();

// router.post("/storeKey", verifyAccess, storePrivateKey);

module.exports = router;
