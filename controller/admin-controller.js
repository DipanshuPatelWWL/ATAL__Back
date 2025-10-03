const User = require("../model/user-model")
const bcrypt = require("bcryptjs");



// exports.getAdminById = async (req, res) => {
//   try {
//     let admin = await User.findOne({ _id: req.params.id });
//     if (!admin) return res.status(404).json({ success: false, message: "admin  not found" });
//     res.json({ success: true, admin });
//   } catch (err) {
//     res.status(500).json({ success: false, message: "Error fetching admin" });
//   }
// };










exports.getAdminById = async (req, res) => {
  try {
    let admin = await User.findById(req.params.id).select("-password"); // don’t send password
    if (!admin) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    res.json({
      success: true,
      admin: {
        _id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        profileImage: admin.profileImage || null, //  always return profileImage
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching admin", error: err.message });
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

    if (req.files?.profileImage) {
      updateData.profileImage = req.files.profileImage[0].filename;
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