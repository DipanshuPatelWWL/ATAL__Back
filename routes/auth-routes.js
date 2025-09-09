const express = require("express");
const router = express.Router();
const { register, login, loginNew } = require("../controller/auth-Controller");

router.post("/register", register);
router.post("/login", login);

//new login route vai auto generated pass
router.post("/loginNew", loginNew);

module.exports = router;
