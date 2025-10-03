const Order = require("../model/order-model");
const transporter = require("../utils/mailer");
const paymentTemplate = require("../utils/paymentTemplate");
const generateTrackingNumber = require("../utils/generateTrackingNumber");
const productModel = require("../model/product-model");
const InsurancePolicy = require("../model/InsurancePolicy");



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

//         // Enrich cart items with createdBy (vendor/admin)
//         const cartItemsWithCreator = await Promise.all(
//             req.body.cartItems.map(async (item) => {
//                 const product = await productModel.findById(item.productId);
//                 return {
//                     ...item,
//                     createdBy: product?.createdBy || "admin", // vendor or admin
//                 };
//             })
//         );

//         // Build order object
//         const orderData = {
//             ...req.body,
//             cartItems: cartItemsWithCreator,
//             trackingNumber,
//             trackingHistory: [
//                 {
//                     status: "Placed",
//                     message: "Order placed successfully",
//                 },
//             ],
//         };

//         // Handle insurance
//         if (req.body.insurancePolicyId) {
//             const policy = await InsurancePolicy.findById(req.body.insurancePolicyId);
//             if (!policy) {
//                 return res.status(404).json({ success: false, message: "Selected insurance policy not found" });
//             }

//             const purchasedAt = new Date();
//             const validTill = new Date(purchasedAt.getTime() + policy.durationDays * 24 * 60 * 60 * 1000);

//             orderData.insurance = {
//                 policyId: policy._id,
//                 purchasedAt,
//                 validTill,
//                 pricePaid: policy.price,
//                 status: "Active",
//             };

//             // Add insurance price to order total
//             orderData.total = (orderData.total || 0) + policy.price;
//         }

//         // Create and save order
//         const order = new Order(orderData);
//         await order.save();

//         // Send confirmation email
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

//         // Return
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








exports.createOrder = async (req, res) => {
    try {
        const { email, cartItems, total } = req.body;

        if (!cartItems || cartItems.length === 0) {
            return res
                .status(400)
                .json({ success: false, message: "Cart items are required" });
        }
        if (!email) {
            return res
                .status(400)
                .json({ success: false, message: "Email is required" });
        }

        // ✅ Generate tracking number
        const trackingNumber = generateTrackingNumber();

        // ✅ Map cart items with all details
        const cartItemsWithDetails = await Promise.all(
            cartItems.map(async (item) => {
                const product = await productModel.findById(item.id || item.productId);
                return {
                    productId: item.id || item.productId,
                    name: item.name,
                    price: item.price,
                    image: item.image,
                    product_size: item.product_size || [],
                    product_color: item.product_color || [],
                    insurance: item.insurance || null,
                    lens: item.lens || null,
                    createdBy: product?.createdBy || "admin",
                };
            })
        );

        // ✅ Prepare order data
        const orderData = {
            ...req.body,
            userId: req.user?.id || req.body.userId,
            cartItems: cartItemsWithDetails,
            total: total || 0,
            trackingNumber,
            trackingHistory: [
                { status: "Placed", message: "Order placed successfully" },
            ],
        };

        // ✅ Save order
        const order = new Order(orderData);
        await order.save();

        // ✅ Send confirmation email (non-blocking)
        try {
            await transporter.sendMail({
                from: `"ATAL OPTICALS" <${process.env.EMAIL_USER}>`,
                to: email,
                subject: "Your Order Confirmation",
                html: paymentTemplate(order),
            });
        } catch (mailErr) {
            console.error("Email sending failed:", mailErr.message);
        }

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
    console.log(req.params);

    try {
        const order = await Order.findById(req.params.id)
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


exports.getAllOrders = async (req, res) => {
    try {
        // Fetch all orders
        const orders = await Order.find();

        // Filter orders where at least one cartItem is created by a vendor
        const adminOrders = orders.filter(order =>
            order.cartItems.some(item => item.createdBy && item.createdBy == "admin")
        );

        if (!adminOrders.length) {
            return res
                .status(400)
                .json({ success: false, message: "No admin orders found" });
        }

        res.json({ success: true, orders: adminOrders });
    } catch (err) {
        console.error("Get Orders Error:", err);
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch admin orders" });
    }
};




exports.getAllVendorOrders = async (req, res) => {
    try {
        // Fetch all orders
        const orders = await Order.find();

        // Filter orders where at least one cartItem is created by a vendor
        const vendorOrders = orders.filter(order =>
            order.cartItems.some(item => item.createdBy && item.createdBy !== "admin")
        );

        if (!vendorOrders.length) {
            return res
                .status(404)
                .json({ success: false, message: "No vendor orders found" });
        }

        res.json({ success: true, orders: vendorOrders });
    } catch (err) {
        console.error("Get Orders Error:", err);
        res
            .status(500)
            .json({ success: false, message: "Failed to fetch vendor orders" });
    }
};



// Get Order History by User
exports.getOrderHistory = async (req, res) => {

    try {
        const userId = req.params.userId;

        const orders = await Order.find({ userId })
            .populate("products.productId", "product_name price")
            .sort({ createdAt: -1 }); // latest first

        if (!orders || orders.length === 0) {
            return res.status(404).json({ success: false, message: "No orders found" });
        }

        res.json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
