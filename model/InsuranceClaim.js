const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order", required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
    claimDate: Date,
    description: String,
    photos: [String],
    claimAmount: Number, // corrected spelling
    status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" },
    approvedReplacementOrderId: { type: mongoose.Schema.Types.ObjectId, ref: "Order" },
    notes: String
}, { timestamps: true });

module.exports = mongoose.model("Claim", claimSchema);
