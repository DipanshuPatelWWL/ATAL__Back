const express = require("express");
const router = express.Router();
const orderController = require("../controller/order-controller");

router.post("/order", orderController.createOrder);
router.get("/order/:id", orderController.getOrderById);

module.exports = router;