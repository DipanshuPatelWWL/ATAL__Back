const express = require("express");
const router = express.Router();

const { registerCustomer, fetchCustomerById } = require("../controller/Customer-Register-controller");
const upload = require("../middleware/multer");

// Register route (with prescription upload)
router.post(
    "/customer-register",
    upload.single("prescriptionFile"),
    registerCustomer
);
router.get("/customer/:id", fetchCustomerById);

module.exports = router;
