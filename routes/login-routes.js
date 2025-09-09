const express = require("express");
const { loginCustomer } = require("../controller/login-controller");
const router = express.Router();

router.post("/customer-login", loginCustomer);

module.exports = router;
