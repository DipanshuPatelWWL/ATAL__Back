const Order = require("../model/order-model");

exports.createOrder = async (req, res) => {
    try {
        if (!req.body || !req.body.userId) {
            return res.status(400).json({ message: "No order data provided" });
        }

        const order = new Order(req.body);
        await order.save();

        res.status(201).json({ message: "Order placed successfully", order });
    } catch (error) {
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
