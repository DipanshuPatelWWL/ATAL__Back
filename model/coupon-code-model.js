const mongoose = require("mongoose")

const couponCodeSchema = new mongoose.Schema({
    coupon: { type: String, required: true },
    applicableFor: { type: String, required: true }
})

module.exports = mongoose.model("CouponCode", couponCodeSchema)