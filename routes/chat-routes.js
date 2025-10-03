const express = require("express");
const router = express.Router();
const { protect, authMiddleware } = require("../middleware/auth-middleware");
const { sendMessage, getMessages } = require("../controller/chat-controller");

router.post("/send", protect, authMiddleware(["admin", "vendor"]), sendMessage);
router.get("/:userId", protect, authMiddleware(["admin", "vendor"]), getMessages);

module.exports = router;
