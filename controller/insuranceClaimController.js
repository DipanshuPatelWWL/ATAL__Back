const Claim = require("../model/InsuranceClaim");

// // Customer: Submit claim
// exports.submitClaim = async (req, res) => {
//   try {
//     const { policy, purchaseId, claimAmount } = req.body;
//     const customerId = req.user.id;

//     const claim = new InsuranceClaim({
//       customer: customerId,
//       policy,
//       purchaseId,
//       claimAmount
//     });

//     await claim.save();
//     res.status(201).json({ success: true, data: claim });    
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };

// // Admin: Get all claims
// exports.getClaims = async (req, res) => {
//   try {
//     const claims = await InsuranceClaim.find()
//       .populate("customer", "name email")
//       .populate("policy");
//     res.json({ success: true, data: claims });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Customer: Get claim history
// exports.getCustomerClaims = async (req, res) => {
//   try {     
//     const customerId = req.user.id;
//     const claims = await InsuranceClaim.find({ customer: customerId })
//       .populate("policy")
//       .sort({ createdAt: -1 });

//     res.json({ success: true, data: claims });
//   } catch (err) {
//     res.status(500).json({ success: false, message: err.message });
//   }
// };

// // Admin: Update claim status
// exports.updateClaimStatus = async (req, res) => {
//   try {
//     const claim = await InsuranceClaim.findByIdAndUpdate(
//       req.params.id,
//       { status: req.body.status },
//       { new: true }
//     );
//     res.json({ success: true, data: claim });
//   } catch (err) {
//     res.status(400).json({ success: false, message: err.message });
//   }
// };





// 👉 Get all claim requests
exports.getAllClaims = async (req, res) => {
  try {
    const claims = await Claim.find()
      .populate("userId", "name email")
      .populate("orderId");
    res.status(200).json(claims);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch claims", error });
  }
};

// 👉 Update claim status (Approve / Reject)
exports.updateClaimStatus = async (req, res) => {
  try {
    const { claimId } = req.params;
    const { status, notes } = req.body;

    if (!["Approved", "Rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await Claim.findByIdAndUpdate(
      claimId,
      { status, notes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Claim not found" });
    }

    res.status(200).json({ message: `Claim ${status}`, claim: updated });
  } catch (error) {
    res.status(500).json({ message: "Failed to update claim status", error });
  }
};



// ✅ Create a new claim
exports.createClaim = async (req, res) => {
  try {
    const { orderId, incidentDate, description, deductibleAmount, userId } = req.body;

    // 📸 Handle uploaded photos
    const photos = req.files?.photos?.map(file => `/${file.filename}`) || [];

    const newClaim = new Claim({
      orderId,
      userId,
      incidentDate,
      description,
      photos,
      deductibleAmount,
    });

    await newClaim.save();

    res.status(201).json({
      success: true,
      message: "Claim submitted successfully",
      claim: newClaim,
    });
  } catch (error) {
    console.error("Claim creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to submit claim",
      error: error.message,
    });
  }
};
