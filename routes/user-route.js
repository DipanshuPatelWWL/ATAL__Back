const express = require("express");
const { updateProfile } = require("../controller/user-controller");
const { authMiddleware } = require("../middleware/auth-middleware");

const router = express.Router();


const multer = require("multer");
const upload = multer({ dest: "uploads/" });

router.put("/profile", authMiddleware(["vendor", "company", "admin"]), upload.single("photo"), updateProfile);


// router.put("/profile", authMiddleware(["vendor", "company", "admin"]), updateProfile);

module.exports = router;
