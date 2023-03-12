const express = require("express");
const {
  addPass,
  showPass,
  deletePass,
  updatePass,
  getallpass,
  getPass,
} = require("../controllers/password");
const { verifyRefresh, verifyAccess } = require("../middleware/verifyToken");
const router = express.Router();

router.post("/addPass", verifyAccess, addPass);
router.post("/showPass/:passId", verifyAccess, showPass);
router.delete("/delPass/:passId", verifyAccess, deletePass);
router.put("/updatePass/:passId", verifyAccess, updatePass);

router.get("/getallpass", verifyAccess, getallpass);
router.post("/getpass/:passId", verifyAccess, getPass);

module.exports = router;
