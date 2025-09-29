const InsurancePolicy = require("../model/InsurancePolicy");

// Admin: Add policy
exports.addPolicy = async (req, res) => {
  try {
    const policy = new  InsurancePolicy(req.body);
    await policy.save();
    res.status(201).json({ success: true, data: policy });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Get all active policies (Customer + Admin)
exports.getPolicies = async (req, res) => {
  try {
    const policies = await InsurancePolicy.find({ status: true });
    res.json({ success: true, data: policies });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// Admin: Update policy
exports.updatePolicy = async (req, res) => {
  try {
    const policy = await InsurancePolicy.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, data: policy });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

// Admin: Deactivate policy
exports.deletePolicy = async (req, res) => {
  try {
    await InsurancePolicy.findByIdAndUpdate(req.params.id, { status: false });
    res.json({ success: true, message: "Policy deactivated" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const Order = require("../model/order-model");
const Policy = require("../model/InsurancePolicy");

exports.addInsuranceToOrder = async (orderId, policyId) => {
    const order = await Order.findById(orderId);
    const policy = await Policy.findById(policyId);

    if (!order || !policy) throw new Error("Order or Policy not found");

    const purchasedAt = new Date();
    const validTill = new Date(purchasedAt.getTime() + policy.durationDays * 24*60*60*1000);

    order.insurance = {
        policyId: policy._id,
        purchasedAt,
        validTill,
        pricePaid: policy.price,
        status: "Active"
    };

    await order.save();
    return order;
}

