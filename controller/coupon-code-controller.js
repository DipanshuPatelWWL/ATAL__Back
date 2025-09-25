const CouponCode = require("../model/coupon-code-model");

const createCouponCode = async (req, res) => {
  try {
    const addCouponCode = req.body;

    if (
      !addCouponCode ||
      !addCouponCode.coupon ||
      !addCouponCode.applicableFor
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Please fill all the details" });
    }

    const newCouponCode = new CouponCode(addCouponCode);

    await newCouponCode.save();
    return res
      .status(200)
      .json({
        success: true,
        message: "Coupon Code details saves successfully",
      });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

//Get Api
const getCouponCode = async (req, res) => {
  try {
    const couponCode = await CouponCode.find();
    return res.status(200).json({
      success: true,
      message: "Coupon Code fetched successfully",
      couponCode,
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error });
  }
};

//Update API
const updateCouponCode = async (req, res) => {
  try {
    const { id } = req.params;
    const { coupon, applicableFor } = req.body;

    const updatedCouponCode = await CouponCode.findByIdAndUpdate(
      id,
      { coupon, applicableFor },
      { new: true }
    );
    if (!updatedCouponCode) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon Code not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Coupon Code Update Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "server error" });
  }
};

//Delete API

const deleteCoupanCode = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCouponCode = await CouponCode.findByIdAndDelete(id);

    if (!deletedCouponCode) {
      return res
        .status(404)
        .json({ success: false, message: "Coupon Code not found" });
    }
    res
      .status(200)
      .json({ success: true, message: "Coupon Code deleted successfully" });
  } catch (error) {
    console.error("error deleting Coupon Code", error);
    res.status(500).json({ message: "server error" });
  }
};

// Validate Coupon API
const validateCouponCode = async (req, res) => {
  try {
    const { code } = req.params;

    if (!code) {
      return res
        .status(400)
        .json({ success: false, message: "Coupon code is required" });
    }

    // Check if coupon exists in DB
    const coupon = await CouponCode.findOne({ coupon: code });

    if (!coupon) {
      return res
        .status(404)
        .json({ success: false, valid: false, message: "Invalid coupon code" });
    }

    return res.status(200).json({
      success: true,
      valid: true,
      message: "Coupon is valid",
      coupon,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = {
  createCouponCode,
  getCouponCode,
  updateCouponCode,
  deleteCoupanCode,
  validateCouponCode
};
