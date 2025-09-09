const express = require("express");
const { updateProfile } = require("../controller/user-controller");
const { authMiddleware } = require("../middleware/auth-middleware");

const router = express.Router();

router.put("/profile", authMiddleware(["vendor", "company"]), updateProfile);

module.exports = router;
