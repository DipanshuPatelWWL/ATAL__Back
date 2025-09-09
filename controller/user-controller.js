// Update Profile (Vendor/Company)
const User = require("../model/user-model");

exports.updateProfile = async (req, res) => {
    try {
        const { id } = req.user;
        const updates = req.body;

        const user = await User.findByIdAndUpdate(
            id,
            { profile: updates },
            { new: true }
        );

        res.json({ message: "Profile updated", user });
    } catch (error) {
        res.status(500).json({ message: "Update error", error: error.message });
    }
};