const express = require("express");
const { addPass, showPass, deletePass, updatePass } = require("../controllers/password");
const { verifyRefresh, verifyAccess } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/addPass",verifyAccess,addPass);
router.get("/showPass/:passId",verifyAccess,showPass)
router.delete("/delPass/:passId",verifyAccess,deletePass)
router.put("/updatePass/:passId",verifyAccess,updatePass)

module.exports = router;