const express = require("express");
const router = express.Router();
const orderController = require("../controller/order-controller");


router.post("/order", orderController.createOrder);


router.get("/order/:id", orderController.getOrderById);


router.get("/order/track/:trackingNumber", orderController.trackOrderByTrackingNumber);

router.put("/order/updateOrderStatus/:orderId/status", orderController.updateOrderStatus);

router.get("/order/getOrderTracking/:orderId/tracking", orderController.getOrderTracking);

module.exports = router;
