// const mongoose = require("mongoose");

// const insuranceClaimSchema = new mongoose.Schema({
//   customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
//   policy: { type: mongoose.Schema.Types.ObjectId, ref: "InsurancePolicy", required: true },
//   purchaseId: { type: String, required: true },
//   claimAmount: { type: String },
//   status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }
// }, { timestamps: true });

// module.exports = mongoose.model("InsuranceClaim", insuranceClaimSchema);


const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    incidentDate: Date,
    description: String,
    photos: [String],
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    deductibleAmount: Number,
    approvedReplacementOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);
