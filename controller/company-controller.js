const Company = require("../model/compnay-model");

// Get all companies
exports.getCompanies = async (req, res) => {
  try {
    const companies = await Company.find().sort({ createdAt: -1 });
    res.json({ success: true, companies });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// Get single company by ID
exports.getCompanyById = async (req, res) => {
  try {
    const company = await Company.findById(req.params.id);
    if (!company) return res.status(404).json({ success: false, message: "Not found" });
    res.json({ success: true, company });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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
