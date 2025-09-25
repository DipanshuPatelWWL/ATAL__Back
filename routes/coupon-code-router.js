const express = require("express")
const router = express.Router()
const { createCouponCode, getCouponCode, updateCouponCode, deleteCoupanCode,validateCouponCode} = require("../controller/coupon-code-controller")


router.post("/addCouponCode", createCouponCode)
router.get("/getCouponCode", getCouponCode)
router.put("/updateCouponCode/:id", updateCouponCode)
router.delete("/deleteCouponCode/:id", deleteCoupanCode)

// Validate
router.get("/validateCoupon/:code", validateCouponCode);


module.exports = router;