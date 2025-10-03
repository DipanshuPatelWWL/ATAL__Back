const User = require("../model/user-model");

// Get a single admin by ID
exports.getAdminById = async (req, res) => {
  try {
    const { id } = req.params;
    const admin = await User.findOne({ _id: id, role: "admin" }).select(
      "-password"
    );
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }
    res.json(admin);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Update admin profile
exports.updateAdminProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, password } = req.body;
    const profileImage = req.file ? `/uploads/${req.file.filename}` : undefined;

    const admin = await User.findOne({ _id: id, role: "admin" });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    admin.name = name || admin.name;
    admin.email = email || admin.email;

    if (password && password.trim() !== "") {
      admin.password = password; // pre-save hook will hash it
    }

    if (profileImage) admin.profileImage = profileImage;

    await admin.save();

    res.json({ message: "Admin profile updated successfully", admin });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
