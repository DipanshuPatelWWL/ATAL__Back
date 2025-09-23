const Order = require("../model/order-model");
const transporter = require("../utils/mailer");
const paymentTemplate = require("../utils/paymentTemplate");


exports.createOrder = async (req, res) => {
    try {
        if (!req.body || !req.body.userId) {
            return res.status(400).json({ message: "No order data provided" });
        }
        if (!req.body.email) {
            return res.status(400).json({ message: "Email is required" });
        }

        const order = new Order(req.body);
        await order.save();

        // Email details
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

        res.status(201).json({
            message: "Order placed successfully",
            order,
        });
    } catch (error) {
        console.error("Order creation error:", error);
        res.status(500).json({ message: error.message });
    }
};



//  Get Order by ID
exports.getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate("userId", "name email")
            .populate("cartItems.productId", "name price image");

        if (!order) return res.status(404).json({ success: false, message: "Order not found" });

        res.json({ success: true, order });
    } catch (err) {
        console.error("Get Order Error:", err);
        res.status(500).json({ success: false, message: "Failed to fetch order" });
    }
};
