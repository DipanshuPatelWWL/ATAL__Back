const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin-controller");

// Get single admin by ID
router.get("/getAdminById/:id", adminController.getAdminById);
router.put("/updateAdminProfile/:id", adminController.updateAdminProfile);


module.exports = router;


