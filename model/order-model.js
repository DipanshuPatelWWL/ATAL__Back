const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },

    cartItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
            name: String,
            image: String,
            price: Number,
            quantity: Number,
        },
    ],

    shippingAddress: {
        fullName: String,
        address: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        phone: String,
    },

    billingAddress: {
        fullName: String,
        address: String,
        city: String,
        province: String,
        postalCode: String,
        country: String,
        phone: String,
    },

    subtotal: Number,
    tax: Number,
    shipping: Number,
    total: Number,

    paymentMethod: { type: String, default: "COD" },
    paymentStatus: { type: String, default: "Pending" },
    transactionId: String,

    orderStatus: {
        type: String,
        enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
        default: "Placed",
    },

    trackingNumber: String,
    deliveryDate: Date,
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
