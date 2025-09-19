const User = require("../model/user-model")
const bcrypt = require("bcryptjs");



exports.getAdminById = async (req, res) => {
  try {
    let admin = await User.findOne( {_id: req.params.id });
    if (!admin) return res.status(404).json({ success: false, message: "admin  not found" });
    res.json({ success: true, admin});
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching admin" });
  }
};

//update admin

exports.updateAdminProfile = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let updateData = { name, email };

    // Hash password only if provided
    if (password && password.trim() !== "") {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(password, salt);
    }

    const admin = await User.findByIdAndUpdate(
      req.params.id,     // admin id from URL
      { $set: updateData },
      { new: true }      // return updated document
    );

    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      message: "Admin profile updated successfully",
      admin,
    });
  } catch (error) {
    console.error("Update Admin Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while updating admin",
      error: error.message,
    });
  }
};