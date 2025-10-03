const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin-controller");
const multer = require("multer");
const { authMiddleware } = require("../middleware/auth-middleware");

// Multer setup for profile images
const upload = multer({ dest: "uploads/" });

// Get single admin by ID (role-based access)
router.get(
  "/getAdminById/:id",
  authMiddleware(["admin", "vendor"]), // only admin can access
  adminController.getAdminById
);

// Update admin profile
router.put(
  "/updateAdminProfile/:id",
  authMiddleware(["admin"]), // only admin can update
  upload.single("profileImage"), // handle single file
  adminController.updateAdminProfile
);

module.exports = router;
