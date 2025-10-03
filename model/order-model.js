// // backend/model/order-model.js
// const mongoose = require("mongoose");

// const orderSchema = new mongoose.Schema({
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
//     email: { type: String, required: true },
//     cartItems: [
//         {
//             productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
//             name: String,
//             image: String,
//             price: Number,
//             quantity: Number,
//             createdBy: { type: String },
//         },
//     ],

//     shippingAddress: {
//         fullName: String,
//         address: String,
//         city: String,
//         province: String,
//         postalCode: String,
//         country: String,
//         phone: String,
//     },

//     billingAddress: {
//         fullName: String,
//         address: String,
//         city: String,
//         province: String,
//         postalCode: String,
//         country: String,
//         phone: String,
//     },

//     subtotal: Number,
//     tax: Number,
//     shipping: Number,
//     total: Number,

//     paymentMethod: { type: String, default: "COD" },
//     paymentStatus: { type: String, default: "Pending" },
//     transactionId: String,

//     orderStatus: {
//         type: String,
//         enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Failed"],
//         default: "Placed",
//     },

//     insurance: {
//         policyId: { type: mongoose.Schema.Types.ObjectId, ref: "InsurancePolicy" }, // <- changed ref
//         purchasedAt: Date,
//         validTill: Date,
//         pricePaid: Number, // the insurance fee customer paid
//         status: { type: String, enum: ["Active", "Expired"], default: "Active" },
//     },
//     product_size: [String],
//     product_color: [String],

//     trackingNumber: String,
//     deliveryDate: Date,

//     trackingHistory: [
//         {
//             status: {
//                 type: String,
//                 enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
//             },
//             message: String,
//             updatedAt: { type: Date, default: Date.now },
//         },
//     ],
// }, { timestamps: true });

// module.exports = mongoose.model("Order", orderSchema);

















// backend/model/order-model.js
const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
        email: { type: String, required: true },

        cartItems: [
            {
                productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
                name: String,
                image: String,
                price: Number,
                quantity: { type: Number, default: 1 },
                createdBy: { type: String },

                // Per-item selections
                product_size: [String],
                product_color: [String],
                lens: Object, // store lens details if selected
                insurance: {
                    policyId: { type: mongoose.Schema.Types.ObjectId, ref: "InsurancePolicy" },
                    purchasedAt: Date,
                    validTill: Date,
                    pricePaid: Number,
                    status: { type: String, enum: ["Active", "Expired"], default: "Active" },
                },
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
            enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned", "Failed"],
            default: "Placed",
        },

        trackingNumber: String,
        deliveryDate: Date,

        trackingHistory: [
            {
                status: {
                    type: String,
                    enum: ["Placed", "Processing", "Shipped", "Delivered", "Cancelled", "Returned"],
                },
                message: String,
                updatedAt: { type: Date, default: Date.now },
            },
        ],
    },
    { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
