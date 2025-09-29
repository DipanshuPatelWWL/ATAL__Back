const InsuranceClaim = require("../model/InsuranceClaim");

// Customer: Submit claim
exports.submitClaim = async (req, res) => {
  try {
    const { policy, purchaseId, claimAmount } = req.body;
    const customerId = req.user.id;

    const claim = new InsuranceClaim({
      customer: customerId,
      policy,
      purchaseId,
      claimAmount
    });

    await claim.save();
    res.status(201).json({ success: true, data: claim });    
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Get all claims
exports.getClaims = async (req, res) => {
  try {
    const claims = await InsuranceClaim.find()
      .populate("customer", "name email")
      .populate("policy");
    res.json({ success: true, data: claims });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Customer: Get claim history
exports.getCustomerClaims = async (req, res) => {
  try {     
    const customerId = req.user.id;
    const claims = await InsuranceClaim.find({ customer: customerId })
      .populate("policy")
      .sort({ createdAt: -1 });

    res.json({ success: true, data: claims });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update claim status
exports.updateClaimStatus = async (req, res) => {
  try {
    const claim = await InsuranceClaim.findByIdAndUpdate(
      req.params.id,
      { status: req.body.status },
      { new: true }
    );
    res.json({ success: true, data: claim });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};
