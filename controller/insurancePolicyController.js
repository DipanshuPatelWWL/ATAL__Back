const InsurancePolicy = require("../model/InsurancePolicy");
const orderModel = require("../model/order-model");

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



// exports.getPoliciesByCompanyId = async (req, res) => {
//   try {
//     const { companyId } = req.params;

//     if (!companyId) {
//       return res.status(400).json({ message: "companyId is required" });
//     }

//     // Find all orders where any cartItem's policy companyId matches
//     const orders = await Order.find({ "cartItems.policy.companyId": companyId })
//       .select("userId email cartItems.policy cartItems.name cartItems.image cartItems.price cartItems.product_size cartItems.product_color")
//       .populate("userId", "name email") // Optional: populate user details
//       .populate("cartItems.productId", "name image price"); // Optional: populate product details

//     // Format response (flatten cartItems with policies)
//     const result = [];

//     orders.forEach((order) => {
//       order.cartItems.forEach((item) => {
//         if (item.policy && item.policy.companyId?.toString() === companyId) {
//           result.push({
//             userId: order.userId,
//             email: order.email,
//             product: {
//               productId: item.productId,
//               name: item.name,
//               image: item.image,
//               price: item.price,
//               size: item.product_size,
//               color: item.product_color,
//             },
//             policy: item.policy,
//           });
//         }
//       });
//     });

//     return res.status(200).json({
//       success: true,
//       count: result.length,
//       policies: result,
//     });
//   } catch (error) {
//     console.error("Error fetching policies:", error);
//     res.status(500).json({ message: "Server error", error });
//   }
// };


// backend/controller/order_controller.js

// Get all policies by companyId
// exports.getPoliciesByCompanyId = async (req, res) => {
//   try {
//     const { companyId } = req.params;

//     if (!companyId) {
//       return res.status(400).json({ success: false, message: "Company ID is required" });
//     }

//     // Fetch all orders containing policies from this company
//     const orders = await orderModel.find({ "cartItems.policy.companyId": companyId });

//     if (!orders.length) {
//       return res.status(404).json({ success: false, message: "No policies found for this company" });
//     }

//     // Extract policies from cartItems
//     const policies = [];

//     orders.forEach(order => {
//       order.cartItems.forEach(item => {
//         if (item.policy && item.policy.companyId === companyId) {
//           policies.push({
//             orderId: order._id,
//             userId: order.userId,
//             email: order.email,
//             policy: item.policy,
//             createdAt: order.createdAt,
//             updatedAt: order.updatedAt
//           });
//         }
//       });
//     });

//     res.status(200).json({
//       success: true,
//       count: policies.length,
//       policies,
//     });

//   } catch (error) {
//     console.error("Error fetching policies:", error);
//     res.status(500).json({
//       success: false,
//       message: "Server error while fetching policies",
//       error: error.message,
//     });
//   }
// };






// ✅ Get all orders that purchased a policy from a specific insurance company
exports.getPoliciesByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;

    if (!companyId) {
      return res.status(400).json({
        success: false,
        message: "Company ID is required",
      });
    }

    // Fetch only orders where the policy belongs to the given company
    const orders = await orderModel.find({
      "cartItems.policy.companyId": companyId,
    });

    if (!orders.length) {
      return res.status(404).json({
        success: false,
        message: "No orders found with purchased policies for this company.",
      });
    }

    // Only extract safe, company-relevant info
    const companyPolicies = [];

    orders.forEach(order => {
      order.cartItems.forEach(item => {
        if (item.policy && item.policy.companyId === companyId) {
          companyPolicies.push({
            orderId: order._id,
            policyId: item.policy.policyId,
            policyName: item.policy.name,
            policyPrice: item.policy.price,
            coverage: item.policy.coverage,
            durationDays: item.policy.durationDays,
            purchasedAt: item.policy.purchasedAt,
            expiryDate: item.policy.durationDays
              ? new Date(new Date(item.policy.purchasedAt).getTime() + item.policy.durationDays * 24 * 60 * 60 * 1000)
              : null,
            status: item.policy.status || "Active",

            // Customer info (minimal & safe)
            customer: {
              name: order.shippingAddress?.fullName || order.billingAddress?.fullName || "N/A",
              email: order.email,
              phone: order.shippingAddress?.phone || order.billingAddress?.phone || "N/A",
            },

            product: {
              name: item.name,
              price: item.price,
              image: item.image
            },

            // Order details
            orderStatus: order.orderStatus,
            paymentStatus: order.paymentStatus,
            createdAt: order.createdAt,
            updatedAt: order.updatedAt,
          });
        }
      });
    });

    return res.status(200).json({
      success: true,
      companyId,
      count: companyPolicies.length,
      policies: companyPolicies,
    });

  } catch (error) {
    console.error("Error fetching company policy orders:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching company policy orders",
      error: error.message,
    });
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
    await InsurancePolicy.findByIdAndUpdate(req.params.id, { active: false });
    res.json({ success: true, message: "Policy deactivated" });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

