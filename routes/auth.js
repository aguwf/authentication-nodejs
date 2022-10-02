var express = require("express");
const {
  register,
  login,
  forgotPassword,
  changePassword,
} = require("../controllers/user.controller");
var router = express.Router();

/* GET login listing. */
router.post("/login", login);

router.post("/register", register);

router.post("/reset-password", forgotPassword);

router.post("/change-password", changePassword);

module.exports = router;
