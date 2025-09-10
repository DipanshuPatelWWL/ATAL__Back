const Company = require("../model/compnay-model");
const User = require("../model/user-model")
const bcrypt = require("bcryptjs");
// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json({ success: true, companies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get company by ID
exports.getCompanyById = async (req, res) => {
  try {
    let company = await Company.findOne({ userId: req.params.id });
    if (!company) return res.status(404).json({ success: false, message: "Company not found" });
    res.json({ success: true, company });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching vendor" });
  }
};

// Update company
exports.updateCompany = async (req, res) => {
  try {
    const updated = await Company.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        signedAgreement: req.files?.agreementFile?.[0]?.path || req.body.signedAgreement,
        licenseProof: req.files?.licenseProof?.[0]?.path || req.body.licenseProof,
        voidCheque: req.files?.voidCheque?.[0]?.path || req.body.voidCheque,
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ success: false, message: "Not found" });

    res.json({ success: true, company: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Delete company
exports.deleteCompany = async (req, res) => {
  try {
    const deleted = await Company.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, message: "Company deleted" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};



exports.updateCompProfile = async (req, res) => {
  try {
    // find company by userId
    const company = await Company.findOne({ userId: req.params.id });
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const updateData = { ...req.body };

    // Prevent updating restricted fields
    const restrictedFields = [
      "status",
      "adminResponse",
      "agreementAccepted",
      "createdAt",
      "updatedAt",
      "userId", // prevent changing user binding
    ];
    restrictedFields.forEach((field) => delete updateData[field]);

    // Handle password update (update User model, not Company)
    if (req.body.companyPassword) {
      const hashedPassword = await bcrypt.hash(req.body.companyPassword, 10);
      await User.findByIdAndUpdate(company.userId, { password: hashedPassword });
      delete updateData.companyPassword;
    }

    // Handle uploaded files (multer.fields case → arrays)
    if (req.files) {
      if (req.files.licenseProof?.[0]) {
        updateData.licenseProof = req.files.licenseProof[0].filename;
      }
      if (req.files.signedAgreement?.[0]) {
        updateData.signedAgreement = req.files.signedAgreement[0].filename;
      }
      if (req.files.voidCheque?.[0]) {
        updateData.voidCheque = req.files.voidCheque[0].filename;
      }
    }

    const updatedCompany = await Company.findByIdAndUpdate(
      company._id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      message: "Profile updated successfully",
      company: updatedCompany,
    });
  } catch (error) {
    console.error("Update Profile Error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
