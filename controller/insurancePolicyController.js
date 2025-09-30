const InsurancePolicy = require("../model/InsurancePolicy");

// Admin: Add policy
exports.addPolicy = async (req, res) => {
  try {
    const { name, coverage, price, durationDays } = req.body;

    //  Get company from req.body (frontend must send it)
    const { companyId, companyName } = req.body;

    if (!companyId || !companyName) {
      return res.status(400).json({ success: false, message: "Company info required" });
    }

    const policy = new InsurancePolicy({
      name,
      coverage,
      price,
      durationDays,
      companyId,
      companyName
    });

    await policy.save();
    res.status(201).json({ success: true, data: policy });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all active policies (Customer + Admin)
exports.getPolicies = async (req, res) => {
  try {
    const policies = await InsurancePolicy.find({ active: true }); //  use "active"
    res.json({ success: true, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update policy
exports.updatePolicy = async (req, res) => {
  try {
    const policy = await InsurancePolicy.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json({ success: true, data: policy });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Deactivate policy
exports.deletePolicy = async (req, res) => {
  try {
    await InsurancePolicy.findByIdAndUpdate(req.params.id, { active: false }); // ✅ use "active"
    res.json({ success: true, message: "Policy deactivated" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

