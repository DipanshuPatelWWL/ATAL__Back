const Order = require("../model/order-model");
const transporter = require("../utils/mailer");
const paymentTemplate = require("../utils/paymentTemplate");
const generateTrackingNumber = require("../utils/generateTrackingNumber");


// exports.createOrder = async (req, res) => {
//     try {
//         // Basic validation
//         if (!req.body || !req.body.userId) {
//             return res.status(400).json({ message: "No order data provided" });
//         }
//         if (!req.body.email) {
//             return res.status(400).json({ message: "Email is required" });
//         }

//         // Generate unique tracking number
//         const trackingNumber = generateTrackingNumber();

//         // Create new order
//         const order = new Order({
//             ...req.body,
//             trackingNumber,  // assign tracking number
//             trackingHistory: [
//                 {
//                     status: "Placed",
//                     message: "Order placed successfully",
//                 },
//             ],
//         });

//         await order.save();

//         //  Send confirmation email
//         const mailOptions = {
//             from: `"ATAL OPTICALS" <${process.env.EMAIL_USER}>`,
//             to: req.body.email,
//             subject: "Your Order Confirmation",
//             html: paymentTemplate(order),
//         };

//         try {
//             await transporter.sendMail(mailOptions);
//         } catch (mailErr) {
//             console.error("Email sending failed:", mailErr.message);
//         }

//         //  Send response to client
//         res.status(201).json({
//             success: true,
//             message: "Order placed successfully",
//             order,
//         });
//     } catch (error) {
//         console.error("Order creation error:", error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };


// exports.getOrderById = async (req, res) => {
//     try {
//         const order = await Order.findById(req.params.id)
//             .populate("userId", "name email")
//             .populate("cartItems.productId", "name price image");

//         if (!order) {
//             return res.status(404).json({ success: false, message: "Order not found" });
//         }

//         res.json({ success: true, order });
//     } catch (err) {
//         console.error("Get Order Error:", err);
//         res.status(500).json({ success: false, message: "Failed to fetch order" });
//     }
// };




exports.createOrder = async (req, res) => {
    try {
        // Basic validation
        if (!req.body || !req.body.userId) {
            return res.status(400).json({ message: "No order data provided" });
        }
        if (!req.body.email) {
            return res.status(400).json({ message: "Email is required" });
        }

        // Generate unique tracking number
        const trackingNumber = generateTrackingNumber();

        // Build order object
        const orderData = {
            ...req.body,
            trackingNumber,  // assign tracking number
            trackingHistory: [
                {
                    status: "Placed",
                    message: "Order placed successfully",
                },
            ],
        };

        // If customer selected an insurance policy (from checkout)
        if (req.body.insurancePolicyId) {
            const policy = await InsurancePolicy.findById(req.body.insurancePolicyId);
            if (!policy) {
                return res.status(404).json({ success: false, message: "Selected insurance policy not found" });
            }

            const purchasedAt = new Date();
            const validTill = new Date(purchasedAt.getTime() + policy.durationDays * 24 * 60 * 60 * 1000);

            orderData.insurance = {
                policyId: policy._id,
                purchasedAt,
                validTill,
                pricePaid: policy.price,
                status: "Active",
            };

            // Add insurance price to order total (remove if frontend already included)
            orderData.total = (orderData.total || 0) + policy.price;
        }

        // Create and save order
        const order = new Order(orderData);
        await order.save();

        // Send confirmation email
        const mailOptions = {
            from: `"ATAL OPTICALS" <${process.env.EMAIL_USER}>`,
            to: req.body.email,
            subject: "Your Order Confirmation",
            html: paymentTemplate(order),
        };

        try {
            await transporter.sendMail(mailOptions);
        } catch (mailErr) {
            console.error("Email sending failed:", mailErr.message);
        }

        // Return
        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "name email")
            .populate("cartItems.productId", "name price image")
            .populate("insurance.policyId", "name coverage price durationDays"); // populate insurance detail

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({ success: true, order });
    } catch (err) {
        console.error("Get Order Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
};



exports.updateOrderStatus = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { status, trackingNumber, deliveryDate, message } = req.body;

        const order = await Order.findById(orderId);
        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        //  Update fields
        if (status) order.orderStatus = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (deliveryDate) order.deliveryDate = deliveryDate;

        //  Log status change in tracking history
        order.trackingHistory.push({
            status: status || order.orderStatus,
            message: message || `Order updated to ${status || order.orderStatus}`,
        });

        await order.save();

        res.json({
            success: true,
            message: "Order updated successfully",
            order,
        });
    } catch (err) {
        console.error("Update Order Error:", err);
        res.status(500).json({ success: false, message: "Server error" });
    }
};


exports.getOrderTracking = async (req, res) => {
    try {
        const { orderId } = req.params;
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({
            success: true,
            trackingNumber: order.trackingNumber,
            status: order.orderStatus,
            deliveryDate: order.deliveryDate,
            trackingHistory: order.trackingHistory,
        });
    } catch (err) {
        console.error("Get Order Tracking Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};


exports.trackOrderByTrackingNumber = async (req, res) => {
    try {
        const { trackingNumber } = req.params;

        //  Find order by tracking number (case-insensitive)
        const order = await Order.findOne({
            trackingNumber: trackingNumber.toUpperCase(),
        });

        if (!order) {
            return res.status(404).json({ success: false, message: "Order not found" });
        }

        res.json({
            success: true,
            trackingNumber: order.trackingNumber,
            status: order.orderStatus,
            deliveryDate: order.deliveryDate,
            trackingHistory: order.trackingHistory,
            shippingAddress: order.shippingAddress,
            total: order.total,
        });
    } catch (err) {
        console.error("Track Order Error:", err);
        res.status(500).json({ success: false, message: err.message });
    }
};
